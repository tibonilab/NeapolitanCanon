import React from 'react';

import { useStateWithSession } from '../service/serviceStorage';

import { COLLECTIONS } from '../model/INDEXES';

import AnalysisContext from './analysisContext';

const SESSION_PREFIX = 'AnalysisState';

const AnalysisState = props => {

    const [dateRange, setDateRange] = useStateWithSession({}, 'dateRange', SESSION_PREFIX);

    const [collections, setCollections] = useStateWithSession(COLLECTIONS.map(element => element.field), 'collections', SESSION_PREFIX);

    const [isContextBarVisible, setContextBarVisibility] = useStateWithSession(true, 'isContextBarVisible', SESSION_PREFIX);

    const [pinnedDocuments, setPinnedDocuments] = useStateWithSession([], 'pinnedDocuments', SESSION_PREFIX);

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