import React, { useState } from 'react';

import { normalizeFacetsResults } from '../../model/Solr';
import { renderFacetLabel } from '../../model/INDEXES';
import { t } from '../../i18n';

import ListBox from '../template/components/ListBox.jsx';

const FacetsSelector = ({ searchResults, searchTerms, toggleSearchFilter }) => {

    const [showMore, setShowMore] = useState([]);

    const isMoreVisible = key => showMore.includes(key);

    const showMoreFacets = key => e => {
        e.preventDefault();

        if (isMoreVisible(key)) {
            setShowMore(showMore.filter(search => search !== key));
        } else {
            setShowMore([...showMore, key]);
        }
    };

    return Object.keys(searchResults.facets).map(key => {

        const normalizedFacets = normalizeFacetsResults(searchResults.facets[key]);

        if (normalizedFacets.length == 0) {
            return null;
        }

        return (
            <ListBox
                key={key}
                header={(
                    <React.Fragment>
                        <span>{renderFacetLabel(key)}</span>
                        <span>{normalizedFacets.length}</span>
                    </React.Fragment>
                )}>
                {
                    normalizedFacets.map(
                        (facet, index) =>
                            (index < 10 || showMore.includes(key)) && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: searchTerms.filters.includes(
                                            `${key}:${facet.label}`
                                        )
                                            ? '#eee'
                                            : 'transparent'
                                    }}
                                    key={index}
                                    onClick={() =>
                                        toggleSearchFilter(key, facet.label)
                                    }
                                >
                                    <span>{facet.label}</span>
                                    <span style={{ fontSize: '90%', fontWeight: 'bold' }}>{facet.count}</span>
                                </div>
                            )
                    )
                }
                {
                    normalizedFacets.length > 10 && (

                        <a href="#" onClick={showMoreFacets(key)} style={{ margin: '10px 0 0 5px', display: 'block' }}>
                            {t(isMoreVisible(key) ? 'search.facets.less' : 'search.facets.more')}
                        </a>

                    )
                }
            </ListBox>
        );
    });
};

export default FacetsSelector;