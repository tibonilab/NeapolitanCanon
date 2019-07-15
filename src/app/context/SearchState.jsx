import React, { useState, useEffect, useContext } from 'react';

import SearchContext from './searchContext';
import { useDidMount } from '../hooks/useDidMount';

import { DEFAULT_FACETS } from '../model/INDEXES';
import Solr from '../model/Solr';

import AnalysisContext from './analysisContext';

const SearchState = props => {

    const [isLoading, setIsLoading] = useState(false);

    const [selectedResource, setSelectedResource] = useState(null);

    const [searchResults, setSearchResults] = useState({
        numFound: null,
        results: [],
        facets: [],
    });

    const [searchTerms, setSearchTerms] = useState({
        searchKey: '',
        indexes: [],
        filters: [],
        facets: {
            fields: DEFAULT_FACETS
        },
        page: 0
    });

    const analysisContext = useContext(AnalysisContext);


    const searchParamChangeHandler = param => value => {
        setSearchTerms(
            (() => {
                switch (param) {
                default: return { ...searchTerms, [param]: value };
                case 'indexes': return { ...searchTerms, [param]: value ? [value] : [] };
                }
            })()
        );
    };

    const toggleSearchFilter = (field, value) => {
        if (searchTerms.filters.includes(`${field}:${value}`)) {
            setSearchTerms({ ...searchTerms, filters: searchTerms.filters.filter(f => f !== `${field}:${value}`) });
        } else {
            setSearchTerms({ ...searchTerms, filters: searchTerms.filters.concat(`${field}:${value}`) });
        }
    };

    const setSearchSolrResponse = solr => {
        setIsLoading(false);
        setSearchResults({
            ...searchResults,
            numFound: solr.response.numFound,
            results: solr.response.docs,
            facets: solr.facet_counts ? solr.facet_counts.facet_fields : [],
        });
    };

    const setSearchSelected = element => {
        setSelectedResource(element);
    };

    const unsetSearchSelected = () => {
        setSelectedResource(null);
    };

    const searchFormSubmitHandler = e => {
        e && e.preventDefault();

        setIsLoading(true);
        setSearchResults({
            ...searchResults,
            numFound: 0,
            results: [],
            facets: []
        });

        performSearch(searchTerms);
    };


    const performSearch = searchTerms => {
        return Solr
            .search({
                ...searchTerms,
                dateRange: analysisContext.dateRange,
                collections: analysisContext.collections
            })
            .then(setSearchSolrResponse);
    };

    const selectPage = page => {
        setSearchTerms({
            ...searchTerms,
            page
        });
    };


    // we use useDidMount Hook to let the component know whether is mounted or not
    const didMount = useDidMount();

    // we want to perform a search when a filter in searchTerms changes.
    // The useEffect Hook calls the function as first parameter on mounting 
    // and when the dependendecies in the second parameter change
    useEffect(
        () => {
            didMount && performSearch(searchTerms);
        },
        [searchTerms.filters, searchTerms.page]
    );

    return (
        <SearchContext.Provider
            value={{
                searchResults,
                searchTerms,
                selectedResource,
                isLoading,
                searchParamChangeHandler,
                toggleSearchFilter,
                setSearchSelected,
                unsetSearchSelected,
                searchFormSubmitHandler,
                selectPage
            }}
        >
            {props.children}
        </SearchContext.Provider>
    );
};

export default SearchState;