import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import { PrimaryButton } from '../components/template/components/Buttons.jsx';
import Paginator from '../components/template/components/Paginator.jsx';
import FixedHeader from '../components/template/components/FixedHeader.jsx';
import ActionLink from '../components/template/components/ActionLink.jsx';
import ActionButton from '../components/template/components/ActionButton.jsx';

import Select from '../components/form/Select.jsx';
import DocumentDetail from '../components/shared/DocumentDetail.jsx';
import SearchResults from '../components/shared/SearchResults.jsx';
import PaginationHeader from '../components/shared/PaginationHeader.jsx';

import { generateBrowseIndexes, renderFacetLabel } from '../model/INDEXES';

import BrowseContext from '../context/browseContext';
import AnalysisContext from '../context/analysisContext';

import { t } from '../i18n';

const BrowsePage = () => {

    // we store the BrowseContext into the context const here to be able to
    // use the data and functions stored into the BrowseState component
    // which provides the BrowseContext.Provider
    const browseContext = useContext(BrowseContext);
    const analysisContext = useContext(AnalysisContext);

    const renderLoading = () => {
        return browseContext.isLoading ? <div style={{ marginTop: '2em' }}>{'loading'}</div> : null;
    };

    const renderBrowseNav = () => {
        let firstLetter;
        const letters = [];

        normalizeFacetsResults(browseContext.browseResults).forEach(term => {
            if (firstLetter != term.label.substring(0, 1)) {
                firstLetter = term.label.substring(0, 1);
                letters.push(firstLetter);
            }
        });

        return browseContext.browseResults.length > 0
            ? (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2em' }}>
                    <b>Fast nav: </b>
                    {
                        letters.map(letter => <a style={{ padding: '.2em .3em', borderRight: '1px solid #eee', color: '#515151', textDecoration: 'none' }} key={letter} href={`#${letter}`}>{letter}</a>)
                    }
                </div>
            )
            : null;
    };

    const renderBrowseResults = () => {

        let firstLetter;
        const letters = [];

        const results = normalizeFacetsResults(browseContext.browseResults).map((term, index) => {
            let header;

            if (firstLetter != term.label.substring(0, 1)) {
                firstLetter = term.label.substring(0, 1);
                letters.push(firstLetter);

                header = (
                    <div style={{ borderBottom: '1px solid #eee', padding: '0 0 .5em 0', margin: '2em 0 .5em 0' }}>
                        <a className="anchor" id={firstLetter} />
                        <h1>{firstLetter}</h1>
                    </div>
                );

            }

            return (
                <React.Fragment key={index}>

                    {header}

                    <div onClick={() => browseContext.fetchIndexElements(term.label, index)} style={{ cursor: 'pointer' }}>
                        <h4>{term.label}</h4>
                    </div>
                </React.Fragment>
            );
        });

        return results.length > 0
            ? results
            : <h3 style={{ marginTop: '3em' }}>{t('browse.noResults')}</h3>;
    };

    const renderIndexResults = () => (
        <React.Fragment>
            <FixedHeader>
                <ActionLink action={browseContext.unsetSearchResults}>
                    {t('browse.back')}
                </ActionLink>

                <h1>{`${renderFacetLabel(browseContext.currentIndex.index)}: ${browseContext.searchResults.index}`}</h1>

                <ActionButton action={browseContext.selectPrevious} disabled={browseContext.currentIndex.position < 1}>
                    {t('browse.prev')}
                </ActionButton>
                <ActionButton action={browseContext.selectNext} disabled={browseContext.currentIndex.position + 1 == normalizeFacetsResults(browseContext.browseResults).length}>
                    {t('browse.next')}
                </ActionButton>
                <ActionButton action={() => browseContext.gotoSearch(browseContext.searchResults.index)}>
                    {t('browse.search')}
                </ActionButton>

                <PaginationHeader {...browseContext} />
            </FixedHeader>

            <div style={{ paddingTop: '7.5em' }}>
                {
                    browseContext.isLoading
                        ? (
                            <span>Loading</span>
                        )
                        : (
                            <React.Fragment>
                                {browseContext.searchResults.results.length > 0
                                    ? <SearchResults {...browseContext} {...analysisContext} />
                                    : t('browse.noSearchResults')}

                                <Paginator
                                    onClickHandler={page => browseContext.selectPage(page - 1)}
                                    page={browseContext.searchTerms.page + 1}
                                    totalPages={Math.ceil(browseContext.searchResults.numFound / 100)}
                                />
                            </React.Fragment>
                        )
                }
            </div>

        </React.Fragment>
    );

    const renderForm = () => (
        <FixedHeader>
            <form onSubmit={browseContext.onFormSubmitHandler}>
                <div style={{ display: 'flex', jusityContent: 'flext-start' }}>
                    <Select
                        style={{ width: 'auto' }}
                        value={browseContext.currentIndex.index}
                        placeholder={t('browse.form.select_placeholder')}
                        options={generateBrowseIndexes()}
                        onChangeHandler={browseContext.onSelectChangeHandler}
                    />
                    <PrimaryButton type="submit" disabled={!browseContext.currentIndex.index}>{t('browse.form.submit')}</PrimaryButton>
                    {renderBrowseNav()}
                </div>
            </form>
        </FixedHeader>
    );

    const renderView = () => {

        let view = (
            <React.Fragment>
                {renderForm()}
                <div style={{ padding: '3em 0 1em 0' }}>
                    {browseContext.isLoading ? renderLoading() : renderBrowseResults()}
                </div>
            </React.Fragment>
        );

        if (browseContext.searchResults.index) {
            view = renderIndexResults();
        }

        if (browseContext.selectedResource) {
            view = <DocumentDetail {...browseContext} />;
        }

        return view;
    };


    console.log(browseContext.currentIndex);
    console.log(browseContext.searchResults);

    return (
        <Template>
            {renderView()}
        </Template>
    );
};

export default BrowsePage;