import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import Select from '../components/form/Select.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import { BROWSE_INDEXES, renderFacetLabel } from '../model/INDEXES';

import BrowseContext from '../context/browseContext';

const BrowsePage = () => {

    // we store the BrowseContext into the context const here to be able to
    // use the data and functions stored into the BrowseState component
    // which provides the BrowseContext.Provider
    const context = useContext(BrowseContext);

    const renderLoading = () => {
        return context.isLoading ? <div style={{ marginTop: '2em' }}>{'loading'}</div> : null;
    };

    const renderBrowseNav = () => {
        let firstLetter;
        const letters = [];

        normalizeFacetsResults(context.browseResults).forEach(term => {
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

        if (context.browseResults) {
            let firstLetter;
            const letters = [];

            const results = normalizeFacetsResults(context.browseResults).map((term, index) => {
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

                        <div onClick={() => context.fetchIndexElements(term.label, index)} style={{ cursor: 'pointer' }}>
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
                    context.unsetSearchResults();
                }}
            >
                back
            </a>

            <h1>{`${renderFacetLabel(context.currentIndex.index)}: ${context.searchResults.index}`}</h1>

            <button
                onClick={e => {
                    e.preventDefault();
                    context.selectPrevious();
                }}
                disabled={context.currentIndex.position < 1}
            >
                &laquo; previous
            </button>
            <button
                onClick={e => {
                    e.preventDefault();
                    context.selectNext();
                }}
                disabled={context.currentIndex.position + 1 == normalizeFacetsResults(context.browseResults).length}
            >
                next &raquo;
            </button>
            <button
                onClick={e => {
                    e.preventDefault();
                    context.gotoSearch(context.searchResults.index);
                }}>
                search
            </button>


            {
                context.searchResults.results.map(element => (
                    <div
                        key={element.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => context.setSearchSelected(element)}
                    >
                        <br />
                        <h2>{element.title_s}</h2>
                        <h3>{element.place_s} - {element.year_i}</h3>
                    </div>
                ))
            }
        </React.Fragment>
    );

    const renderDivaWrapper = () => {
        const element = context.selectedResource;

        return (
            <React.Fragment>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        context.unsetSearchSelected();
                    }}
                >
                    Go back
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
            onSubmit={context.onFormSubmitHandler}
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
                    value={context.currentIndex.index}
                    placeholder="Select index"
                    options={BROWSE_INDEXES}
                    onChangeHandler={context.onSelectChangeHandler}
                />
                <PrimaryButton type="submit" disabled={!context.currentIndex.index}>browse</PrimaryButton>
                {renderBrowseNav()}
            </div>
        </form>
    );

    const renderView = () => {

        let view = (
            <React.Fragment>
                {renderForm()}
                <div style={{ padding: '3em 0 1em 0' }}>
                    {context.isLoading ? renderLoading() : renderBrowseResults()}
                </div>
            </React.Fragment>
        );

        if (context.searchResults.index) {
            view = renderIndexResults();
        }

        if (context.selectedResource) {
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