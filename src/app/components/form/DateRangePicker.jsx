import React, { Component } from 'react'; 

import Input from './Input.jsx';
import SliderRange from './SliderRange.jsx';

export default class DateRangePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            from: props.minFrom || '',
            to: props.maxTo || ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(field) {
        return value => {
            this.setState({[field]: value}, this.emitData);
        };
    }

    onSliderChangeHandler({ from, to }) {
        this.setState({ from, to }, this.emitData);
    }

    emitData() {
        if(this.props.onChangeHandler && typeof this.props.onChangeHandler === 'function') {
            this.props.onChangeHandler(this.state);
        }
    }

    render() {
        const { from, to } = this.state;

        return (
            <div style={{width: 350}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Input 
                        value={from}
                        onChangeHandler={this.onChangeHandler('from')}
                    />
                    <Input 
                        value={to}
                        onChangeHandler={this.onChangeHandler('to')}
                    />

                </div>
                <SliderRange
                    onChangeHandler={this.onSliderChangeHandler.bind(this)}
                    min={this.props.minFrom}
                    max={this.props.maxTo}
                />
            </div>
        );
    }
}