import React from 'react';

import { t } from '../../i18n';

const getPrevPage = page => page && page - 1;
const getNextPage = (page, totalPages) => page + 1 < totalPages ? page + 1 : page;

const PaginationHeader = ({ isLoading, searchResults, searchTerms, selectPage }) => {

    console.log(isLoading, searchResults);

    const switchPage = page => e => {
        e.preventDefault();

        selectPage(page);
    };

    const totalPages = Math.ceil(searchResults.numFound / 100);

    const counts = {
        from: searchTerms.page * 100 + 1,
        to: searchTerms.page + 1 < totalPages ? (searchTerms.page + 1) * 100 : searchResults.numFound,
        total: searchResults.numFound
    };

    return (
        <React.Fragment>
            {
                !isLoading && searchResults.numFound
                    ? (
                        <div style={{ marginTop: '1em' }}>
                            {
                                getPrevPage(searchTerms.page) === searchTerms.page ? (
                                    <span>{t('search.nav.prev')}</span>
                                ) : (
                                    <a href="#" onClick={switchPage(getPrevPage(searchTerms.page))}>
                                        {t('search.nav.prev')}
                                    </a>
                                )
                            }
                            <span> | </span>
                            <b>{t('search.nav.count', counts)}</b>
                            <span> | </span>
                            {
                                getNextPage(searchTerms.page, totalPages) === searchTerms.page ? (
                                    <span>{t('search.nav.next')}</span>
                                ) : (
                                    <a href="#" onClick={switchPage(getNextPage(searchTerms.page, totalPages))}>
                                        {t('search.nav.next')}
                                    </a>
                                )
                            }

                        </div>
                    )
                    : null
            }
        </React.Fragment>
    );
};

export default PaginationHeader;