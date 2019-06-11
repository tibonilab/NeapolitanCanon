import React, { useContext } from 'react';

import { ContextBar } from '../template/components/ContextBar.jsx';

import DateRangePicker from '../form/DateRangePicker.jsx';
import CollectionsSelector from './CollectionsSelector.jsx';

import AnalysisContext from '../../context/analysisContext';

export const ContextBarSelector = props => {
    const context = useContext(AnalysisContext);

    return (
        <ContextBar visible={props.visible} toggleBar={props.toggleBar}>
            <h4>Collections</h4>
            <CollectionsSelector
                collections={context.collections}
                onChangeHandler={context.changeCollectionsSelectorHandler}
            />

            <h4>Date range</h4>
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