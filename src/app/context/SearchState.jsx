import React, { useEffect, useContext } from 'react';

import { useStateWithSession } from '../service/serviceStorage';

import SearchContext from './searchContext';
import AnalysisContext from './analysisContext';

import { useDidMount } from '../hooks/useDidMount';

import { DEFAULT_FACETS } from '../model/INDEXES';
import Solr from '../model/Solr';

const SESSION_PREFIX = 'SearchState';

const SearchState = props => {

    const [isLoading, setIsLoading] = useStateWithSession(false, 'isLoading', SESSION_PREFIX);

    const [selectedResource, setSelectedResource] = useStateWithSession(null, 'selectedResource', SESSION_PREFIX);

    const [searchResults, setSearchResults] = useStateWithSession({
        numFound: null,
        results: [],
        facets: [],
    }, 'searchResults', SESSION_PREFIX);

    const [searchTerms, setSearchTerms] = useStateWithSession({
        searchKey: '',
        indexes: [],
        filters: [],
        facets: {
            fields: DEFAULT_FACETS
        },
        page: 0
    }, 'searchTerms', SESSION_PREFIX);

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
            setSearchTerms({
                ...searchTerms,
                filters: searchTerms.filters.filter(f => f !== `${field}:${value}`),
                page: 0
            });
        } else {
            setSearchTerms({
                ...searchTerms,
                filters: searchTerms.filters.concat(`${field}:${value}`),
                page: 0
            });
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

        searchTerms.page
            ? selectPage(0)
            : performSearch(searchTerms);
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

    // The useEffect Hook calls the function as first parameter on mounting 
    // and when the dependendecies in the second parameter change
    useEffect(
        () => {
            if (didMount) {
                // we want to update search results only after the first search
                searchResults.numFound != null && performSearch({
                    ...searchTerms,
                    dateRange: analysisContext.dateRange,
                    collection: analysisContext.collections
                });
            }
        },
        [
            searchTerms.filters,
            searchTerms.page,
            analysisContext.dateRange,
            analysisContext.collections
        ]
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
                selectPage,
                setSearchTerms
            }}
        >
            {props.children}
        </SearchContext.Provider>
    );
};

export default SearchState;