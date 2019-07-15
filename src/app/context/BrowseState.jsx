import React, { useState, useContext } from 'react';

import Solr from '../model/Solr';

import BrowseContext from './browseContext';
import AnalysisContext from './analysisContext';

const BrowseState = props => {

    const [browseResults, setBrowseResults] = useState([]);

    const [searchResults, setSearchResults] = useState({});

    const [currentIndex, setCurrentIndex] = useState({});

    const [browseTerms, setBrowseTerms] = useState({
        facets: {
            fields: [],
            prefix: '',
            sort: 'index'
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    const [selectedResource, setSelectedResource] = useState(null);

    const analysisContext = useContext(AnalysisContext);

    const setSearchSelected = element => {
        setSelectedResource(element);
    };

    const unsetSearchSelected = () => {
        setSelectedResource(null);
    };

    const onSelectChangeHandler = index => {
        const updateBrowseTerms = { ...browseTerms, facets: { ...browseTerms.facets, fields: [index] } };
        setBrowseTerms(updateBrowseTerms);
        setCurrentIndex({ index });
    };

    const onPrefixFilterChangeHandler = prefix => {
        const updateBrowseTerms = { ...browseTerms, facets: { ...browseTerms.facets, prefix } };
        setBrowseTerms(updateBrowseTerms);
    };

    const fetchIndexElements = (searchKey, position) => {
        let searchTerms = {};

        if (currentIndex.index === 'year_i') {
            searchTerms = {
                dateRange: {
                    from: searchKey,
                    to: searchKey
                },
                searchKey
            };
        } else {
            searchTerms = {
                searchKey,
                indexes: [currentIndex.index]
            };
        }

        setCurrentIndex({
            ...currentIndex,
            position
        });
        performSearch(searchTerms);
    };

    const onFormSubmitHandler = (e) => {
        e && e.preventDefault();

        setIsLoading(true);
        setSearchResults([]);
        setBrowseResults([]);

        performBrowse(browseTerms);
    };

    const storeSolrBrowseResults = solrBrowseResults => {
        setIsLoading(false);
        setBrowseResults(solrBrowseResults.facet_counts.facet_fields[currentIndex.index]);
    };

    const performBrowse = browseTerms => {
        return Solr
            .search({
                ...browseTerms,
                dateRange: analysisContext.dateRange,
                collections: analysisContext.collections
            })
            .then(storeSolrBrowseResults);
    };

    const storeSolrSearchResults = searchKey => solrSearchResults => {
        // setSearchResults({
        //     ...searchResults,
        //     [searchKey]: solrSearchResults.response.docs
        // });
        setSearchResults({
            index: searchKey,
            results: solrSearchResults.response.docs
        });
    };

    const unsetSearchResults = () => setSearchResults({});

    const performSearch = searchTerms => {
        return Solr
            .search(searchTerms)
            .then(storeSolrSearchResults(searchTerms.searchKey));
    };

    const selectNext = () => {
        const nextKey = currentIndex.position + 1;
        const normalizedResults = Solr.normalizeFacetsResults(browseResults);

        if (normalizedResults[nextKey]) {
            const term = normalizedResults[nextKey];

            fetchIndexElements(term.label, nextKey);
            setCurrentIndex({
                ...currentIndex,
                position: nextKey
            });
        }
    };


    const selectPrevious = () => {
        const prevKey = currentIndex.position - 1;
        const normalizedResults = Solr.normalizeFacetsResults(browseResults);

        if (normalizedResults[prevKey]) {
            const term = normalizedResults[prevKey];

            fetchIndexElements(term.label, prevKey);
            setCurrentIndex({
                ...currentIndex,
                position: prevKey
            });
        }
    };

    return (
        <BrowseContext.Provider
            value={{
                isLoading,
                browseTerms,
                currentIndex,
                browseResults,
                searchResults,
                selectedResource,
                setSearchSelected,
                unsetSearchSelected,
                onFormSubmitHandler,
                onSelectChangeHandler,
                onPrefixFilterChangeHandler,
                fetchIndexElements,
                unsetSearchResults,
                selectNext,
                selectPrevious
            }}
        >
            {props.children}
        </BrowseContext.Provider>
    );
};

export default BrowseState;