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

    console.log(context);

    const renderLoading = () => {
        return context.isLoading ? 'loading' : null;
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

            return (
                <React.Fragment>
                    {
                        letters.map(letter => <a style={{ padding: '.5em 1em', borderRight: '1px solid #eee', color: '#515151', textDecoration: 'none' }} key={letter} href={`#${letter}`}>{letter}</a>)
                    }
                    {results}
                </React.Fragment>
            );
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
        return (
            <React.Fragment>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        context.unsetSearchSelected();
                    }}
                >
                    close
                </a>
                <Diva manifest={context.selectedResource.id} />
            </React.Fragment>
        );
    };

    const renderForm = () => (
        <form onSubmit={context.onFormSubmitHandler}>
            <div style={{ display: 'flex', jusityContent: 'flext-start' }}>
                <Select
                    value={context.currentIndex.index}
                    placeholder="Select index"
                    options={BROWSE_INDEXES}
                    onChangeHandler={context.onSelectChangeHandler}
                />
                <PrimaryButton type="submit" disabled={!context.currentIndex.index}>browse</PrimaryButton>
            </div>
        </form>
    );

    const renderView = () => {

        let view = (
            <React.Fragment>
                {renderForm()}
                <div style={{ padding: '1em 0' }}>
                    {renderLoading()}
                    {renderBrowseResults()}
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