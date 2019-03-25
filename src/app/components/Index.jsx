import React, { Component } from 'react';

import RestClient from '../service/RestClient';

import Input from './form/Input.jsx';

export default class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            loading: false
        }

        this.debounce;
    }

    onInputChangeHandler(value) {

        this.debounce && clearTimeout(this.debounce);

        this.setState(
            () => ({ 
                list: [],
                loading: true 
            }),
            () => this.debounce = setTimeout(() => RestClient
                .get({ 
                    url: '/solr/onstage/select',
                    config: {params: {
                        q: `interpreter_ss:${value}*`,
                        rows: 100,
                        wt: 'json'
                    }}
                })
                .then(list => this.setState({ 
                    list,
                    loading: false
                })                
            ), 500)
        );
    }

    renderLoading() {
        return this.state.loading ? 'loading' : null
    }

    renderList() {
        if(this.state.list.response && this.state.list.response.docs) {
            return this.state.list.response.docs.map(element => (
                <div key={element.id}>
                    {element.title_s}, {element.place_s}
                </div>
            ))
        }

        return null;
    };

    render() {
        return (
            <div>
                <h1>Hello World</h1>

                <Input onChangeHandler={this.onInputChangeHandler.bind(this)} placeholder="Try ''Denger''..."/>                    

                <div style={{padding: '1em 0'}}>
                    {this.renderLoading()}
                    {this.renderList()}
                </div>
            </div>
        )
    }
}