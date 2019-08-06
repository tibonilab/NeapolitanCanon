import React from 'react';

import { t } from '../../i18n';

const SearchResults = ({ searchResults, setSearchSelected, togglePinnedDocument, isPinned }) => searchResults.results.map(element => (
    <div
        key={element.id}
        style={{ paddingBottom: '1em', borderBottom: '1px solid #efefef', marginTop: '1em' }}
    >
        <a href="#" onClick={e => {
            e.preventDefault();
            setSearchSelected(element);
        }}>{element.title_s}</a>
        <p>
            {element.place_s} - {element.year_i}
        </p>
        <button
            onClick={e => {
                e.preventDefault();
                togglePinnedDocument(element);
            }}
        >
            {isPinned(element) ? t('search.actions.unpin') : t('search.actions.pin')}
        </button>
    </div>
));

export default SearchResults;