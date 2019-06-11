import React, { useState } from 'react';

import { COLLECTIONS } from '../model/INDEXES';

import AnalysisContext from './analysisContext';

const AnalysisState = props => {

    const [dateRange, setDateRange] = useState({});

    const [collections, setCollections] = useState(COLLECTIONS.map(element => element.field));

    const [isContextBarVisible, setContextBarVisibility] = useState(true);

    const dateRangeChangeHandler = dateRange => setDateRange(dateRange);

    const changeCollectionsSelectorHandler = collections => setCollections(collections);

    const toggleContextBar = () => setContextBarVisibility(!isContextBarVisible);

    return (
        <AnalysisContext.Provider
            value={{
                dateRange,
                collections,
                dateRangeChangeHandler,
                changeCollectionsSelectorHandler,
                isContextBarVisible,
                toggleContextBar
            }}
        >
            {props.children}
        </AnalysisContext.Provider>
    );
};

export default AnalysisState;