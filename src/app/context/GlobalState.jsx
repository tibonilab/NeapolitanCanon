import React, { Component } from 'react';

import GlobalContext from './globalContext';

import { DEFAULT_FACETS, COLLECTIONS } from '../model/INDEXES';
import Solr from '../model/Solr';


class GlobalState extends Component {

    state = {
        search: {
            searchTerms: {
                searchKey: '',
                indexes: [],
                facets: {
                    fields: DEFAULT_FACETS
                },
                filters: [],
                collections: COLLECTIONS.map(element => element.field),
                dateRange: {}
            },
            numFound: null,
            results: [],
            facets: [],
            loading: false,
            selected: null
        }
    }

    searchParamChangeHandler = param => value => {

        const { searchTerms } = this.state.search;

        this.setState({ 
            search: Object.assign({}, this.state.search, {
                searchTerms: (
                    () => {
                        switch(param) {
                        case 'searchKey': 
                            return Object.assign({}, searchTerms, {
                                [param]: value
                            });
                                
                        case 'indexes': 
                            return Object.assign({}, searchTerms, {
                                [param]: value ? [value] : []
                            });
                                
                        case 'dateRange':
                            return Object.assign({}, searchTerms, { 
                                dateRange: Object.assign({}, searchTerms.dateRange, value) 
                            });
                        }
                    }
                )() 
            })
        });
    };

    performSearch = () => {
        return Solr
            .search(this.state.search.searchTerms)
            .then(this.setSearchSolrResponse.bind(this));
    }

    setSearchFilter = (field, value) => {
        const { searchTerms } = this.state.search;

        this.setState({
            search: Object.assign({}, this.state.search, { 
                searchTerms: Object.assign({}, searchTerms, {
                    filters: searchTerms.filters.concat(`${field}:${value}`)
                })
            })
        }, this.performSearch);
    }

    unsetSearchFilter = (field, value) => {
        const { searchTerms } = this.state.search;

        this.setState({
            search: Object.assign({}, this.state.search, { 
                searchTerms: Object.assign({}, searchTerms, {
                    filters: searchTerms.filters.filter(f => f !== `${field}:${value}`)
                })
            })
        }, this.performSearch);
    }

    toggleSearchFilter = (field, value) => {
        if (this.state.search.searchTerms.filters.includes(`${field}:${value}`)) {
            this.unsetSearchFilter(field, value);
        } else {
            this.setSearchFilter(field, value);
        }
    }

    setSearchSolrResponse = (solr) => {
        this.setState({ 
            search: Object.assign({}, this.state.search, {
                numFound: solr.response.numFound,
                results: solr.response.docs,
                facets: solr.facet_counts ? solr.facet_counts.facet_fields : [],
                loading: false 
            })
        });
    }

    setSearchSelected = element => {
        this.setState({
            search: Object.assign({}, this.state.search, {
                selected: element
            })
        });
    }

    unsetSearchSelected = () => {
        this.setState({
            search: Object.assign({}, this.state.search, {
                selected: null
            })
        });
    }

    changeStateCollectionsSelector = collections => {
        this.setState({
            search: Object.assign({}, this.state.search, {
                searchTerms: Object.assign({}, this.state.search.searchTerms, { collections }) 
            })
        });
    }

    searchFormSubmitHandler = e => {
        e && e.preventDefault();

        this.setState({
            search: Object.assign({}, this.state.search, {
                numFound: 0,
                results: [], 
                loading: true 
            })
        }, this.performSearch);
    }

    render() {
        return (
            <GlobalContext.Provider 
                value={{
                    search: this.state.search,
                    searchParamChangeHandler: this.searchParamChangeHandler,
                    toggleSearchFilter: this.toggleSearchFilter,
                    setSearchSolrResponse: this.setSearchSolrResponse,
                    performSearch: this.performSearch,
                    setSearchSelected: this.setSearchSelected,
                    unsetSearchSelected: this.unsetSearchSelected,
                    changeStateCollectionsSelector: this.changeStateCollectionsSelector,
                    searchFormSubmitHandler: this.searchFormSubmitHandler
                }}
            >
                {this.props.children}
            </GlobalContext.Provider>
        );
    }

}

export default GlobalState;