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
            loading: false
        };
    }

    onSelectChangeHandler(index) {
        this.setState(
            () => ({ 
                searchResults: [], 
                browseResults: [],
                loading: true 
            }),
            () => Solr
                .browse({ index, sort: 'index' })
                .then(browseResults => this.setState({ browseResults, loading: false }))
        );
    }

    renderLoading() {
        return this.state.loading ? 'loading' : null;
    }

    renderBrowseResults() {
        if(this.state.browseResults) {
            return this.state.browseResults.map((term, index) => (
                index % 2 === 0 && <div key={index}>{term}</div>
            ));
        }

        return null;
    }

    render() {
        return (
            <Template>

                <h4>Browse</h4>
                <Select
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