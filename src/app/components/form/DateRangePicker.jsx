import React, { Component } from 'react';

import Input from './Input.jsx';
import SliderRange from './SliderRange.jsx';

import './DateRangePicker.scss';

export default class DateRangePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            from: props.from ? props.from : props.minFrom || '',
            to: props.to ? props.to : props.maxTo || ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.from !== this.props.from) {
            this.setState({ from: this.props.from });
        }

        if (prevProps.to !== this.props.to) {
            this.setState({ to: this.props.to });
        }
    }

    componentDidMount() {
        this.emitData();
    }

    onChangeHandler(field) {
        return value => {
            this.setState({ [field]: value }, this.emitData);
        };
    }

    onSliderChangeHandler({ from, to }) {
        this.setState({ from, to });
    }

    onSliderUpdatedHandler({ from, to }) {
        this.setState({ from, to }, this.emitData);
    }

    emitData() {
        if (this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(this.state);
        }
    }

    render() {
        const { from, to } = this.state;

        return (
            <div className="dateRangePicker-root">
                <div className="dateRangePicker-inputs" style={{  }}>
                    <Input
                        style={{width: '80px'}}
                        value={from}
                        onChangeHandler={this.onChangeHandler('from')}
                    />
                
                    <Input
                        style={{width: '80px'}}
                        value={to}
                        onChangeHandler={this.onChangeHandler('to')}
                    />    
                </div>
                <SliderRange
                    onChangeHandler={this.onSliderChangeHandler.bind(this)}
                    sliderUpdatedHandler={this.onSliderUpdatedHandler.bind(this)}
                    from={this.state.from}
                    to={this.state.to}
                    min={this.props.minFrom}
                    max={this.props.maxTo}
                />
            </div>
        );
    }
}