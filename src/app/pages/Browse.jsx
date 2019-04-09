import React, { Component } from 'react';

import Solr from '../model/Solr';

import Template from '../components/template/Template.jsx';
import Select from '../components/form/Select.jsx';

import { BROWSE_INDEXES } from '../model/INDEXES';

export default class Browse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            browseResults: [],
            loading: false,
            index: ''
        };
    }

    onSelectChangeHandler(index) {
        this.setState(
            () => ({ 
                searchResults: [], 
                browseResults: [],
                loading: true,
                index
            }),
            () => Solr
                .browse({ index, sort: 'index' })
                .then(browseResults => this.setState({ browseResults, loading: false }))
        );
    }

    renderLoading() {
        return this.state.loading ? 'loading' : null;
    }

    search(searchKey) {
        let payload = {};

        if(this.state.index === 'year_i') {
            payload = {
                dateRange: {
                    from: searchKey,
                    to: searchKey
                }
            };
        } else {
            payload = {
                searchKey,
                indexes: [this.state.index]
            };
        }
        
        Solr
            .search(payload)
            .then(solr => this.setState(
                () => ({ 
                    searchResults: Object.assign({}, this.state.searchResults, {
                        [searchKey]: solr.response.docs
                    })
                }), 
                () => console.log(this.state.searchResults)
            ));
    }

    renderBrowseResults() {
        if(this.state.browseResults) {
            return Solr.normalizeFacetsResults(this.state.browseResults).map((term, index) => (
                <div key={index} onClick={() => this.search(term.label)} style={{cursor:'pointer'}}>
                    <h4>{term.label}</h4>
                    {
                        this.state.searchResults[term.label] && (
                            <div>
                                {
                                    this.state.searchResults[term.label].map(element => (
                                        <div key={element.id}>
                                            <br />
                                            <h2>{element.title_s}</h2> 
                                            <h3>{element.place_s} - {element.year_i}</h3>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            ));
        }

        return null;
    }

    render() {
        return (
            <Template>

                <h4>Browse</h4>
                <Select
                    value={this.state.index}
                    placeholder="Select index"
                    options={BROWSE_INDEXES}
                    onChangeHandler={this.onSelectChangeHandler.bind(this)} 
                />

                <div style={{padding: '1em 0'}}>
                    {this.renderLoading()}
                    {this.renderBrowseResults()}
                </div>
            </Template>
        );
    }
}