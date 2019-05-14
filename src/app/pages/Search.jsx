import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';
import DateRangePicker from '../components/form/DateRangePicker.jsx';
import CollectionsSelector from '../components/shared/CollectionsSelector.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import { SEARCH_INDEXES } from '../model/INDEXES';

import SearchContext from '../context/searchContext';

const SearchPage = () => {

    // we store the SearchContext into the context const here to be able to
    // use the data and functions stored into the SearchState component
    // which provides the SearchContext.Provider
    const context = useContext(SearchContext);

    const renderLoading = () => {
        return context.isLoading ? 'loading' : null;
    };

    const renderSearchResults = () => {
        return context.searchResults.results.length > 0 ? (
            <div style={{ display: 'flex', jusityContent: 'flext-start' }}>
                <div style={{ padding: '2em 0', width: '300px' }}>
                    <h3>Facets</h3>
                    {renderFacets()}
                </div>
                <div style={{ padding: '2em' }}>
                    <h3>Found {context.searchResults.numFound} results.</h3>
                    {context.searchResults.results.map(element => (
                        <div
                            key={element.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => context.setSearchSelected(element)}
                        >
                            <br />
                            <h2>{element.title_s}</h2>
                            <h3>
                                {element.place_s} - {element.year_i}
                            </h3>
                            <div style={{ display: 'none' }}>
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
                                    <div style={{ paddingLeft: '2em' }}>
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
                    ))}
                </div>
            </div>
        ) : (
            context.searchResults.numFound === 0 && <h3>No results found</h3>
        );
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

    const renderFacets = () => {
        return Object.keys(context.searchResults.facets).map(key => (
            <div key={key}>
                <br />
                <h4>{key}</h4>
                {normalizeFacetsResults(context.searchResults.facets[key]).map(
                    (facet, index) =>
                        index < 10 && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    background: context.searchTerms.filters.includes(
                                        `${key}:${facet.label}`
                                    )
                                        ? 'red'
                                        : 'transparent'
                                }}
                                key={index}
                                onClick={() =>
                                    context.toggleSearchFilter(key, facet.label)
                                }
                            >
                                <span>{facet.label}</span>
                                <span>{facet.count}</span>
                            </div>
                        )
                )}
            </div>
        ));
    };

    return (
        <Template>
            <h4>Search</h4>

            <form
                onSubmit={context.searchFormSubmitHandler}
                style={{ display: 'flex', jusityContent: 'flext-start' }}
            >
                <Input
                    value={context.searchTerms.searchKey}
                    onChangeHandler={context.searchParamChangeHandler(
                        'searchKey'
                    )}
                />
                <button type="submit">search</button>
            </form>

            <div>
                <h4>Advanced</h4>
                <Select
                    value={context.searchTerms.indexes[0]}
                    label="Search by index"
                    placeholder="Select index"
                    options={[{ label: 'Full-text', value: '' }].concat(
                        SEARCH_INDEXES
                    )}
                    onChangeHandler={context.searchParamChangeHandler(
                        'indexes'
                    )}
                />

                <div>
                    <h4>Collections</h4>
                    <CollectionsSelector
                        collections={context.searchTerms.collections}
                        onChangeHandler={
                            context.changeCollectionsSelectorHandler
                        }
                    />
                </div>

                <div>
                    <h4>Date range</h4>
                    <DateRangePicker
                        onChangeHandler={context.searchParamChangeHandler(
                            'dateRange'
                        )}
                        from={context.searchTerms.dateRange.from}
                        to={context.searchTerms.dateRange.to}
                        minFrom={1826}
                        maxTo={2016}
                    />
                </div>
            </div>

            <div style={{ padding: '1em 0' }}>
                {renderLoading()}
                {context.selectedResource
                    ? renderDivaWrapper()
                    : renderSearchResults()}
            </div>
        </Template>
    );
};

export default SearchPage;
