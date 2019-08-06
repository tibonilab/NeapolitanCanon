import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import { PrimaryButton } from '../components/template/components/Buttons.jsx';
import Paginator from '../components/template/components/Paginator.jsx';

import Select from '../components/form/Select.jsx';
import Diva from '../components/wrappers/Diva.jsx';
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

    const totalPages = Math.ceil(browseContext.searchResults.numFound / 100);

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

        return <div style={{ display: 'flex', alignItems: 'center' }}>
            {
                letters.map(letter => <a style={{ padding: '.2em .3em', borderRight: '1px solid #eee', color: '#515151', textDecoration: 'none' }} key={letter} href={`#${letter}`}>{letter}</a>)
            }
        </div>;
    };

    const renderBrowseResults = () => {

        if (browseContext.browseResults) {
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

            return results;
        }

        return null;
    };

    const renderIndexResults = () => (
        <React.Fragment>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    browseContext.unsetSearchResults();
                }}
            >
                {t('browse.back')}
            </a>

            <h1>{`${renderFacetLabel(browseContext.currentIndex.index)}: ${browseContext.searchResults.index}`}</h1>

            <button
                onClick={e => {
                    e.preventDefault();
                    browseContext.selectPrevious();
                }}
                disabled={browseContext.currentIndex.position < 1}
            >
                {t('browse.prev')}
            </button>
            <button
                onClick={e => {
                    e.preventDefault();
                    browseContext.selectNext();
                }}
                disabled={browseContext.currentIndex.position + 1 == normalizeFacetsResults(browseContext.browseResults).length}
            >
                {t('browse.next')}
            </button>
            <button
                onClick={e => {
                    e.preventDefault();
                    browseContext.gotoSearch(browseContext.searchResults.index);
                }}>
                {t('browse.search')}
            </button>

            <PaginationHeader {...browseContext} />

            <SearchResults {...browseContext} {...analysisContext} />

            <Paginator
                onClickHandler={page => browseContext.selectPage(page - 1)}
                page={browseContext.searchTerms.page + 1}
                totalPages={totalPages}
            />

        </React.Fragment>
    );

    const renderDivaWrapper = () => {
        const element = browseContext.selectedResource;

        return (
            <React.Fragment>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        browseContext.unsetSearchSelected();
                    }}
                >
                    {t('browse.back')}
                </a>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '100%' }}>
                        <Diva manifest={element.id} />
                    </div>

                    <div style={{ padding: '2em', minWidth: '300px', width: '30%', height: 'calc(100vh - 70px)', overflowY: 'auto', margin: '-3.1em -4em -4em 2em', borderLeft: '1px solid #eee' }}>
                        <h2>{element.title_s}</h2>
                        <h3>
                            {element.place_s} - {element.year_i}
                        </h3>
                        <div style={{ padding: '2em 0' }}>
                            {element.composer_ss && (
                                <div>
                                    <h4>Composers</h4>
                                    {element.composer_ss.map(
                                        (composer, index) => (
                                            <div key={index}>
                                                {composer}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            {element.interpreter_ss && (
                                <div>
                                    <br />
                                    <h4>Interpreters</h4>
                                    {element.interpreter_ss.map(
                                        (interpreter, index) => (
                                            <div key={index}>
                                                {interpreter}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </React.Fragment >
        );
    };

    const renderForm = () => (
        <form
            onSubmit={browseContext.onFormSubmitHandler}
            style={{
                position: 'fixed',
                padding: '2em 4em',
                margin: '-2em -4em',
                background: '#fff'
            }}
        >
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
            view = renderDivaWrapper();
        }

        return view;
    };


    return (
        <Template>
            {renderView()}
        </Template>
    );
};

export default BrowsePage;