import React, { Component } from 'react';

export default class Input extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value || ''
        };
    }

    componentDidUpdate(prevProps) {
        // set the value if is changed outside the component
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    onChangeHandler(e) {
        const value = e.target.value || '';

        this.setState(
            () => ({ value }),
            () => this.emitValue(value)
        );
    }

    emitValue(value) {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(value || this.state.value);
        }
    }

    render() {
        return (
            <div>
                <input
                    value={this.state.value}
                    onChange={this.onChangeHandler.bind(this)}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }

}