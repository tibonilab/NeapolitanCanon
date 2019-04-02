import React, { Component } from 'react';

import Solr from '../model/Solr';

import Template from '../components/template/Template.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';

import { SEARCH_INDEXES, DEFAULT_FACETS } from '../model/INDEXES';

export default class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerms: {
                searchKey: '',
                indexes: [],
                facets: DEFAULT_FACETS,
                filters: [],
                dateRange: {}
            },
            numFound: null,
            results: [],
            facets: [],
            loading: false
        };

        // TODO: move this logic into autocompleter component
        // let timeout;
        // this.debounce = (callback, milliseconds) => {
        //     return (...args) => {
        //         timeout && clearTimeout(timeout);
        //         timeout = setTimeout(() => callback.apply(this, args), milliseconds);
        //     };
        // };

        this.onParamChangeHandler = this.onParamChangeHandler.bind(this);
    }

    onParamChangeHandler(param) {
        return value => {
            this.setState({ 
                // TODO: refactor this switch with a helper or something else..
                searchTerms: (
                    () => {
                        switch(param) {
                        case 'searchKey': 
                            return Object.assign({}, this.state.searchTerms, {
                                [param]: value
                            });
                            
                        case 'indexes': 
                            return Object.assign({}, this.state.searchTerms, {
                                [param]: value ? [value] : []
                            });
                        }
                    }
                )() 
            });
        };

        // TODO: move this logic into autocompleter component
        // () => this.debounce(this.performSearch, 500)()
    }

    setSolrResponse(solr) {
        this.setState({ 
            numFound: solr.response.numFound,
            results: solr.response.docs,
            facets: solr.facet_counts ? solr.facet_counts.facet_fields : [],
            loading: false 
        });
    }

    performSearch() {
        return Solr.search(this.state.searchTerms).then(this.setSolrResponse.bind(this));
    }

    onSearchButtonClickHandler(e) {
        e && e.preventDefault();

        this.setState({
            numFound: 0,
            results: [], 
            loading: true 
        }, this.performSearch);
    }

    renderLoading() {
        return this.state.loading ? 'loading' : null;
    }

    renderSearchResults() {
        return this.state.results.map(element => (
            <div key={element.id}>
                <br />
                <h2>{element.title_s}</h2> 
                <h3>{element.place_s} - {element.year_i}</h3>
                <div style={{display:'none'}}>
                    { 
                        element.composer_ss && (
                            <div>
                                <h4>Composers</h4>
                                {
                                    element.composer_ss.map((composer, index) => <div key={index}>{composer}</div>)
                                }
                            </div>
                        )
                    }
                    { 
                        element.interpreter_ss && (
                            <div style={{paddingLeft: '2em'}}>
                                <h4>Interpreters</h4>
                                {
                                    element.interpreter_ss.map((interpreter, index) => <div key={index}>{interpreter}</div>)
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        ));
    }

    setFilter(field, value) {
        this.setState({
            searchTerms: Object.assign({}, this.state.searchTerms, {
                filters: this.state.searchTerms.filters.concat(`${field}:${value}`)
            })
        }, this.performSearch);
    }

    unsetFilter(field, value) {
        this.setState({
            searchTerms: Object.assign({}, this.state.searchTerms, {
                filters: this.state.searchTerms.filters.filter(f => f !== `${field}:${value}`)
            })
        }, this.performSearch);
    }

    toggleFilter(field, value) {
        if (this.state.searchTerms.filters.includes(`${field}:${value}`)) {
            this.unsetFilter(field, value);
        } else {
            this.setFilter(field, value);
        }
    }

    renderFacets() {
        return Object.keys(this.state.facets).map(key => (
            <div key={key}>
                <br />
                <h4>{key}</h4>
                {Solr.normalizeFacetsResults(this.state.facets[key]).map((facet, index) => index < 10 && <div style={{display: 'flex', justifyContent:'space-between',cursor: 'pointer', background: this.state.searchTerms.filters.includes(`${key}:${facet.label}`) ? 'red' : 'transparent'}} key={index} onClick={e => this.toggleFilter(key, facet.label)}>
                    <span>{facet.label}</span> 
                    <span>{facet.count}</span>
                </div>)}
            </div>
        ));
    }

    render() {
        return (
            <Template>
                <h4>Search</h4>

                <form onSubmit={this.onSearchButtonClickHandler.bind(this)} style={{display:'flex', jusityContent: 'flext-start'}}>
                    <Input 
                        onChangeHandler={this.onParamChangeHandler('searchKey')} 
                    />
                    <button type="submit">search</button>
                </form>


                <div>
                    <h4>Advanced</h4>
                    <Select 
                        label="Search by index"
                        placeholder="Select index"
                        options={[{ label: 'Full-text', value: '' }].concat(SEARCH_INDEXES)}
                        onChangeHandler={this.onParamChangeHandler('indexes')}
                    />
                </div>

                <div style={{padding: '1em 0'}}>
                    {this.renderLoading()}
                    {
                        this.state.results.length > 0 ? (
                            <div style={{display:'flex', jusityContent: 'flext-start'}}>
                                <div style={{padding: '2em 0', width: '300px'}}>
                                    <h3>Facets</h3>
                                    {this.renderFacets()}
                                </div>
                                <div style={{padding: '2em'}}>
                                    <h3>Found {this.state.numFound} results.</h3>
                                    {this.renderSearchResults()}
                                </div>
                            </div>
                        ) : (
                            this.state.numFound != null && <h3>No results found</h3>
                        )
                    }
                </div>
            </Template>
        );
    }
}