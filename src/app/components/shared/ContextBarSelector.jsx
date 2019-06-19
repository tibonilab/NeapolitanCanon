import React, { useContext } from 'react';

import { ContextBar } from '../template/components/ContextBar.jsx';

import DateRangePicker from '../form/DateRangePicker.jsx';
import CollectionsSelector from './CollectionsSelector.jsx';

import AnalysisContext from '../../context/analysisContext';

export const ContextBarSelector = props => {
    const context = useContext(AnalysisContext);

    return (
        <ContextBar visible={props.visible} toggleBar={props.toggleBar}>
            <h4 style={{padding: '0 0 1em 0'}}>Collections</h4>
            <CollectionsSelector
                collections={context.collections}
                onChangeHandler={context.changeCollectionsSelectorHandler}
            />

            <hr style={{marginTop: '2em'}} />

            <h4 style={{padding: '2em 0 1em 0'}}>Date range</h4>
            <DateRangePicker
                from={context.dateRange.from}
                to={context.dateRange.to}
                onChangeHandler={context.dateRangeChangeHandler}
                minFrom={1826}
                maxTo={2016}
            />
        </ContextBar>
    );
};