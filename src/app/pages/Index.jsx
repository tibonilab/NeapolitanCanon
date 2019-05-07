import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

export default class Index extends Component {

    render() {
        return (
            <Template>
                <h1>Welcome</h1>
                <Link to="/search">Search</Link> or <Link to="/browse">Browse</Link>
            </Template>
        );
    }
}