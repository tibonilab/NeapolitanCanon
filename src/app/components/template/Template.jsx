import React, { Component } from 'react';

import '../../../index.scss';

export default class Template extends Component {

    render() {
        return (
            <div className="template-root">
                {this.props.children}
            </div>
        );
    }

}