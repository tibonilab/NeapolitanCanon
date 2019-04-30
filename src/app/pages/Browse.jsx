import React, { Component } from 'react';

import Solr from '../model/Solr';

import Template from '../components/template/Template.jsx';
import Select from '../components/form/Select.jsx';
import Input from '../components/form/Input.jsx';
import CollectionsSelector from '../components/shared/CollectionsSelector.jsx';

import { BROWSE_INDEXES, COLLECTIONS } from '../model/INDEXES';

export default class Browse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            browseResults: [],
            browseTerms: {
                collections: COLLECTIONS.map(element => element.field),
            },
            loading: false,
            facet: '',
            prefix: ''
        };
    }

    onSelectChangeHandler(facet) {
        this.setState({ facet });
    }

    onPrefixFilterChangeHandler(prefix) {
        this.setState({ prefix });
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
                indexes: [this.state.facet]
            };
        }
        
        Solr
            .search(payload)
            .then(solr => this.setState(
                () => ({ 
                    searchResults: Object.assign({}, this.state.searchResults, {
                        [searchKey]: solr.response.docs
                    })
                })
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

    onFormSubmitHandler(e) {
        e && e.preventDefault();

        const facets = {
            fields: [this.state.facet],
            sort: 'index',
            limit: -1,
            mincount: 1,
            ...this.state.prefix != '' && { prefix: this.state.prefix }
        };

        this.setState({ 
            loading: true,
            searchResults: [], 
            browseResults: [],
        }, 
        () => Solr
            .search({ facets, collections: this.state.browseTerms.collections })
            .then(browseResults => this.setState({ browseResults: browseResults.facet_counts.facet_fields[this.state.facet], loading: false }))
        );
    }

    render() {
        return (
            <Template>

                <h4>Browse</h4>
                <form onSubmit={this.onFormSubmitHandler.bind(this)}>
                    <div style={{display:'flex', jusityContent: 'flext-start'}}>
                        <Select
                            value={this.state.facet}
                            placeholder="Select index"
                            options={BROWSE_INDEXES}
                            onChangeHandler={this.onSelectChangeHandler.bind(this)} 
                        />
                        <button type="submit" disabled={this.state.facet == ''}>browse</button>
                    </div>

                    <h4>Collections</h4>
                    <CollectionsSelector
                        collections={this.state.browseTerms.collections}
                        onChangeHandler={collections => this.setState({ browseTerms: Object.assign({}, this.state.browseTerms, { collections })})}
                    />

                    <h4>Filters</h4>
                    <Input 
                        placeholder="prefix" 
                        value={this.state.prefix} 
                        onChangeHandler={this.onPrefixFilterChangeHandler.bind(this)} 
                    />
                </form>

                <div style={{padding: '1em 0'}}>
                    {this.renderLoading()}
                    {this.renderBrowseResults()}
                </div>
            </Template>
        );
    }
}