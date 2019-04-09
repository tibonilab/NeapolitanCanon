import React, { Component } from 'react';

export default class Checkbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: props.checked || false
        };
    }

    onChangeHandler() {
        this.setState({ checked: !this.state.checked }, this.emitChecked());
    }

    emitChecked() {
        if(this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(!this.state.checked);
        }
    }

    render() {
        return (
            <input 
                onChange={this.onChangeHandler.bind(this)}
                type="checkbox" 
                value={this.props.value} 
                name={this.props.name} 
                checked={this.state.checked}
            />
        );
    }

}