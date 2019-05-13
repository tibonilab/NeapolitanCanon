import React, { Component } from 'react';

class Select extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value || ''
        };
    }

    onChangeHandler(e) {
        const value = e.target.value;

        this.setState({ value }, this.emit(value));
    }

    emit(value) {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(value);
        }
    }

    render() {
        const { options, label } = this.props;

        return (
            <div>
                {label && <label>{label}</label>}
                <select
                    value={this.state.value}
                    onChange={this.onChangeHandler.bind(this)}
                >
                    {
                        this.props.placeholder ? (
                            <option value="" disabled hidden>{this.props.placeholder}</option>
                        ) : (
                            <option value="" />
                        )
                    }
                    {
                        options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)
                    }
                </select>
            </div>
        );
    }

}

Select.defaultProps = {
    options: [],
    placeholder: false
};

export default Select;