import React, { Component } from 'react';

import Solr from '../model/Solr';

import Template from '../components/template/Template.jsx';

import Input from '../components/form/Input.jsx';

export default class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchTerms: {
                searchKey: '',
                indexes: [],
                facets: ['composer_ss', 'interpreter_ss', 'place_s', 'collection_s', 'series_s'],
                dateRange: {}
            },
            results: [],
            facets: [],
            loading: false
        };

        let timeout;
        this.debounce = (callback, milliseconds) => {
            return (...args) => {
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => callback.apply(this, args), milliseconds);
            };
        };
    }

    onInputChangeHandler(searchKey) {

        const { facets, dateRange } = this.state.searchTerms;

        this.setState({ 
            results: [], 
            loading: true 
        },
        () => this.debounce(
            () => Solr
                .search({ 
                    searchKey, 
                    dateRange,
                    facets
                })
                .then(solr => this.setState({ 
                    results: solr.response.docs,
                    facets: solr.facet_counts ? solr.facet_counts.facet_fields : [],
                    loading: false 
                }))
            , 500
        )()
        );
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

    renderFacets() {
        return Object.keys(this.state.facets).map(key => (
            <div key={key}>
                <br />
                <h4>{key}</h4>
                {Solr.normalizeFacetsResults(this.state.facets[key]).map((facet, index) => index < 10 && <div key={index}>{facet.label}, {facet.count}</div>)}
            </div>
        ));
    }

    render() {
        return (
            <Template>
                <h4>Search</h4>

                <Input 
                    onChangeHandler={this.onInputChangeHandler.bind(this)} 
                />

                <div style={{padding: '1em 0'}}>
                    {this.renderLoading()}
                    {
                        this.state.results.length > 0 && (
                            <div style={{display:'flex', jusityContent: 'flext-start'}}>
                                <div style={{padding: '2em'}}>
                                    <h3>Search results</h3>
                                    {this.renderSearchResults()}
                                </div>
                                <div style={{padding: '2em'}}>
                                    <h3>Facets</h3>
                                    {this.renderFacets()}
                                </div>
                            </div>

                        )
                    }

                </div>
            </Template>
        );
    }
}