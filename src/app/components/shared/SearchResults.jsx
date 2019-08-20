import React from 'react';

import { t } from '../../i18n';

import SearchResultsItem from '../template/components/SearchResultsItem.jsx';

import ActionLink from '../template/components/ActionLink.jsx';
import { PrimaryButtonSmall } from '../template/components/Buttons.jsx';
import FlexWrapper from '../template/components/FlexWrapper.jsx';
import { PinIcon } from '../template/components/Icons.jsx';

const SearchResults = ({ searchResults, setSearchSelected, togglePinnedDocument, isPinned }) => searchResults.results.map(element => (
    <SearchResultsItem key={element.id}>
        <FlexWrapper justifyContent="space-between">
            <FlexWrapper>
                <img src={`http://d-lib.rism-ch.org/cgi-bin/iipsrv.fcgi?FIF=/usr/local/images/lausanne/${element.images_ss[0]}&WID=40&CVT=JPG`} />
                <div style={{ marginLeft: '1.5em' }}>
                    <h4 style={{ padding: '.25rem 0' }}>
                        <ActionLink action={() => setSearchSelected(element)}>{element.title_s}</ActionLink>
                    </h4>
                    {element.place_s}
                    <br />
                    <span className="small">{element.year_i}</span>
                </div>
            </FlexWrapper>
            <PrimaryButtonSmall action={() => togglePinnedDocument(element)}>
                {isPinned(element) ? t('search.actions.unpin') : t('search.actions.pin')}
            </PrimaryButtonSmall>
            <PinIcon className="icon" fill={isPinned(element) ? '#00b5d6' : '#ccc'} />
        </FlexWrapper>
    </SearchResultsItem>
));

export default SearchResults;