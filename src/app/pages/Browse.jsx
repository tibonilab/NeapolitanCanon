import React, { Component } from 'react';

import Solr from '../model/Solr';

import Template from '../components/template/Template.jsx';
import Select from '../components/form/Select.jsx';
import Input from '../components/form/Input.jsx';
import CollectionsSelector from '../components/shared/CollectionsSelector.jsx';
import DateRangePicker from '../components/form/DateRangePicker.jsx';

import { BROWSE_INDEXES, COLLECTIONS } from '../model/INDEXES';

export default class Browse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            browseResults: [],
            browseTerms: {
                facets: {
                    fields: [],
                    prefix: '',
                    sort: 'index'
                },
                collections: COLLECTIONS.map(element => element.field),
                dateRange: {}
            },
            loading: false,
            index: ''
        };
    }

    onSelectChangeHandler(index) {
        const facets = Object.assign({}, this.state.browseTerms.facets, { fields: [index] });

        this.setState({ index }, this.setBrowseTerms({ facets }));
    }

    onPrefixFilterChangeHandler(prefix) {
        const facets = Object.assign({}, this.state.browseTerms.facets, { prefix });

        this.setBrowseTerms({ facets });
    }

    onDateRangeChangeHandelr(dateRange) {
        this.setBrowseTerms({ dateRange });
    }

    setBrowseTerms(props) {
        this.setState({ browseTerms: Object.assign({}, this.state.browseTerms, props)});
    }

    renderLoading() {
        return this.state.loading ? 'loading' : null;
    }

    fetchIndexElements(searchKey) {
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
                })
            ));
    }

    renderBrowseResults() {
        if(this.state.browseResults) {
            return Solr.normalizeFacetsResults(this.state.browseResults).map((term, index) => (
                <div key={index}>
                    <h4 onClick={() => this.fetchIndexElements(term.label)} style={{cursor:'pointer'}}>{term.label}</h4>
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

        this.setState({ 
            loading: true,
            searchResults: [], 
            browseResults: [],
        }, 
        () => Solr
            .search(this.state.browseTerms)
            .then(browseResults => this.setState({ browseResults: browseResults.facet_counts.facet_fields[this.state.index], loading: false }))
        );
    }

    render() {

        return (
            <Template>

                <h4>Browse</h4>
                <form onSubmit={this.onFormSubmitHandler.bind(this)}>
                    <div style={{display:'flex', jusityContent: 'flext-start'}}>
                        <Select
                            value={this.state.index}
                            placeholder="Select index"
                            options={BROWSE_INDEXES}
                            onChangeHandler={this.onSelectChangeHandler.bind(this)} 
                        />
                        <button type="submit" disabled={this.state.index == ''}>browse</button>
                    </div>

                    <h4>Collections</h4>
                    <CollectionsSelector
                        collections={this.state.browseTerms.collections}
                        onChangeHandler={collections => this.setState({ browseTerms: Object.assign({}, this.state.browseTerms, { collections })})}
                    />

                    <h4>Index Prefix</h4>
                    <Input 
                        placeholder="prefix"
                        onChangeHandler={this.onPrefixFilterChangeHandler.bind(this)} 
                    />

                    <h4>Date range</h4>
                    <DateRangePicker
                        onChangeHandler={this.onDateRangeChangeHandelr.bind(this)}
                        minFrom={1826}
                        maxTo={2016}
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