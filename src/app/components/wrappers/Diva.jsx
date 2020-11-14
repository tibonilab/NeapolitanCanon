import React, { Component } from 'react';

import Diva from 'diva.js/source/js/diva';
import 'diva.js/build/diva.css';

import './permalink.js';
import './snackbar.css';

import './Diva.scss';

export default class DivaReact extends Component {

    constructor(props) {
        super(props);

        this.diva;
        this.divaWrapper;

        this.debouncer;

        this.debounce = (cb, delay) => {
            if (this.debouncer == null) {
                this.debouncer = setTimeout(() => { cb(); this.debouncer = null; }, delay);
            }
        };
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.currentPage != null && this.props.currentPage !== nextProps.currentPage) {
            this.diva && this.diva.gotoPageByIndex(nextProps.currentPage);
        }
    }

    initDiva() {

        if (this.props.manifest) {

            fetch(`${DIVA_BASE_MANIFEST_SERVER}${this.props.manifest}`)
                .then(() => {
                    this.diva = new Diva(this.divaWrapper.id, {
                        objectData: `${DIVA_BASE_MANIFEST_SERVER}${this.props.manifest}`,
                        enableGotoPage: this.props.enableGotoPage != undefined,
                        enableGridIcon: this.props.enableGridIcon != undefined,
                        enableLinkIcon: this.props.enableLinkIcon != undefined,
                        ...this.props.enablePlugins != undefined && { plugins: [Diva.PermalinkPlugin] }
                    });

                    if (this.props.onScrollHandler) {
                        Diva.Events.subscribe('ViewerDidScroll', () => this.debounce(() => this.props.onScrollHandler(this.diva.getActivePageIndex()), 500));
                    }

                    if (this.props.initialPage) {
                        Diva.Events.subscribe('ViewerDidLoad', () => this.diva.gotoPageByIndex(this.props.initialPage));
                    }
                })
                .catch(() => this.divaWrapper.innerHTML = '<div class="no-content"><h5>No image found</h5></div>');
        }
    }

    render() {
        return (
            <div id="diva-wrapper" ref={c => this.divaWrapper = c}></div>
        );

    }

}