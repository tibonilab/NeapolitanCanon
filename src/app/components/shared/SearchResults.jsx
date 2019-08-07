import React from 'react';

import { t } from '../../i18n';

import SearchResultsItem from '../template/components/SearchResultsItem.jsx';

import ActionLink from '../template/components/ActionLink.jsx';
import ActionButton from '../template/components/ActionButton.jsx';

const SearchResults = ({ searchResults, setSearchSelected, togglePinnedDocument, isPinned }) => searchResults.results.map(element => (
    <SearchResultsItem key={element.id}>
        <ActionLink action={() => setSearchSelected(element)}>{element.title_s}</ActionLink>
        <p>{element.place_s} - {element.year_i}</p>
        <ActionButton action={() => togglePinnedDocument(element)}>
            {isPinned(element) ? t('search.actions.unpin') : t('search.actions.pin')}
        </ActionButton>
    </SearchResultsItem >
));

export default SearchResults;