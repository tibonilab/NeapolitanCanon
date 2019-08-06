import React, { useContext, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import { useStateWithSession } from '../service/serviceStorage';
import { useDidMount } from '../hooks/useDidMount';

import { DEFAULT_FACETS } from '../model/INDEXES';
import Solr from '../model/Solr';

import BrowseContext from './browseContext';
import AnalysisContext from './analysisContext';
import SearchContext from './searchContext';

const SESSION_PREFIX = 'BrowseState';

const BrowseState = props => {

    const [browseResults, setBrowseResults] = useStateWithSession([], 'browseResults', SESSION_PREFIX);

    const [searchResults, setSearchResults] = useStateWithSession({}, 'searchResults', SESSION_PREFIX);

    const [searchTerms, setSearchTerms] = useStateWithSession({}, 'searchTerms', SESSION_PREFIX);

    const [currentIndex, setCurrentIndex] = useStateWithSession({}, 'currentIndex', SESSION_PREFIX);

    const [browseTerms, setBrowseTerms] = useStateWithSession({
        facets: {
            fields: [],
            prefix: '',
            sort: 'index'
        }
    }, 'browseTerms', SESSION_PREFIX);

    const [isLoading, setIsLoading] = useStateWithSession(false, 'isLoading', SESSION_PREFIX);

    const [selectedResource, setSelectedResource] = useStateWithSession(null, 'selectedResource', SESSION_PREFIX);

    const analysisContext = useContext(AnalysisContext);
    const searchContext = useContext(SearchContext);

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
        setIsLoading(true);
        setCurrentIndex({
            ...currentIndex,
            position
        });
        performSearch(generateSearchTermsBySearchKey(searchKey));
    };

    const generateSearchTermsBySearchKey = searchKey => {
        let searchTerms = {};

        if (currentIndex.index === 'year_i') {
            searchTerms = {
                dateRange: {
                    from: searchKey,
                    to: searchKey
                },
                searchKey,
                page: 0
            };
        } else {
            searchTerms = {
                searchKey,
                indexes: [currentIndex.index],
                page: 0
            };
        }

        setSearchTerms(searchTerms);

        return searchTerms;
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
        setSearchResults({
            index: searchKey,
            results: solrSearchResults.response.docs,
            numFound: solrSearchResults.response.numFound
        });
        setIsLoading(false);
    };

    const unsetSearchResults = () => setSearchResults({});

    const performSearch = searchTerms => {
        window.scrollTo(0, 0);
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

    const gotoSearch = searchKey => {
        searchContext.setSearchTerms({
            ...generateSearchTermsBySearchKey(searchKey),
            filters: [],
            facets: {
                fields: DEFAULT_FACETS
            },
            page: 0
        });
        props.history.push('/search');
    };

    const selectPage = page => {
        setSearchTerms({
            ...searchTerms,
            page
        });
    };

    // we use useDidMount Hook to let the component know whether is mounted or not
    const didMount = useDidMount();

    useEffect(
        () => {
            didMount && performSearch(searchTerms);
        },
        [searchTerms.page]
    );

    return (
        <BrowseContext.Provider
            value={{
                isLoading,
                browseTerms,
                currentIndex,
                browseResults,
                searchResults,
                searchTerms,
                selectPage,
                selectedResource,
                setSearchSelected,
                unsetSearchSelected,
                onFormSubmitHandler,
                onSelectChangeHandler,
                onPrefixFilterChangeHandler,
                fetchIndexElements,
                unsetSearchResults,
                selectNext,
                selectPrevious,
                gotoSearch
            }}
        >
            {props.children}
        </BrowseContext.Provider>
    );
};

export default withRouter(BrowseState);