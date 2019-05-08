import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../../../index.scss';

export default class Template extends Component {

    render() {
        return (
            <div className="template-root">
                <div style={{ float: 'right' }}>
                    <Link to="/search">Search</Link> or <Link to="/browse">Browse</Link>
                </div>
                {this.props.children}
            </div>
        );
    }

}