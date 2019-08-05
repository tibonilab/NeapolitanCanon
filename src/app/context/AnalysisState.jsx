import React, { useState } from 'react';

import { COLLECTIONS } from '../model/INDEXES';

import AnalysisContext from './analysisContext';

const AnalysisState = props => {

    const [dateRange, setDateRange] = useState({});

    const [collections, setCollections] = useState(COLLECTIONS.map(element => element.field));

    const [isContextBarVisible, setContextBarVisibility] = useState(true);

    const [pinnedDocuments, setPinnedDocuments] = useState([]);

    const dateRangeChangeHandler = dateRange => setDateRange(dateRange);

    const changeCollectionsSelectorHandler = collections => setCollections(collections);

    const toggleContextBar = () => setContextBarVisibility(!isContextBarVisible);

    const togglePinnedDocument = document => {
        if (isPinned(document)) {
            setPinnedDocuments(pinnedDocuments.filter(d => d.id !== document.id));
        } else {
            setPinnedDocuments(pinnedDocuments.concat([document]));
        }
    };

    const isPinned = document => pinnedDocuments.some(d => d.id == document.id);

    return (
        <AnalysisContext.Provider
            value={{
                dateRange,
                collections,
                dateRangeChangeHandler,
                changeCollectionsSelectorHandler,
                isContextBarVisible,
                toggleContextBar,
                pinnedDocuments,
                togglePinnedDocument,
                isPinned
            }}
        >
            {props.children}
        </AnalysisContext.Provider>
    );
};

export default AnalysisState;