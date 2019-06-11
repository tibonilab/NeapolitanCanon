import React, { Component } from 'react';

import Diva from 'diva.js/source/js/diva';
import 'diva.js/build/diva.css';

export default class DivaReact extends Component {

    constructor(props) {
        super(props);

        this.diva;
        this.divaWrapper;
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.manifest !== this.props.manifest;
    }

    componentDidUpdate() {
        this.initDiva();
    }

    componentDidMount() {
        this.initDiva();
    }

    initDiva() {
        if (this.props.manifest) {
            this.diva = new Diva(this.divaWrapper.id, {
                objectData: `${DIVA_BASE_MANIFEST_SERVER}${this.props.manifest}`
            });
        }
    }

    render() {
        return (
            <div id="diva-wrapper" ref={c => this.divaWrapper = c}></div>
        );

    }

}