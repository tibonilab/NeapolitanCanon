import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import Select from '../components/form/Select.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import { BROWSE_INDEXES } from '../model/INDEXES';

import BrowseContext from '../context/browseContext';

const BrowsePage = () => {

    // we store the BrowseContext into the context const here to be able to
    // use the data and functions stored into the BrowseState component
    // which provides the BrowseContext.Provider
    const context = useContext(BrowseContext);

    const renderLoading = () => {
        return context.isLoading ? 'loading' : null;
    };

    const renderBrowseResults = () => {
        if (context.browseResults) {
            return normalizeFacetsResults(context.browseResults).map((term, index) => (
                <div key={index}>
                    <h4 onClick={() => context.fetchIndexElements(term.label)} style={{ cursor: 'pointer' }}>{term.label}</h4>
                    {
                        context.searchResults[term.label] && (
                            <div>
                                {
                                    context.searchResults[term.label].map(element => (
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
                            </div>
                        )
                    }
                </div>
            ));
        }

        return null;
    };

    const renderDivaWrapper = () => {
        return (
            <div>
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
            </div>
        );
    };

    return (
        <Template>

            <h4>Browse</h4>
            <form onSubmit={context.onFormSubmitHandler}>
                <div style={{ display: 'flex', jusityContent: 'flext-start' }}>
                    <Select
                        value={context.currentIndex}
                        placeholder="Select index"
                        options={BROWSE_INDEXES}
                        onChangeHandler={context.onSelectChangeHandler}
                    />
                    <button type="submit" disabled={context.currentIndex == ''}>browse</button>
                </div>
            </form>

            <div style={{ padding: '1em 0' }}>
                {renderLoading()}
                {
                    context.selectedResource
                        ? renderDivaWrapper()
                        : renderBrowseResults()
                }
            </div>
        </Template>
    );
};

export default BrowsePage;