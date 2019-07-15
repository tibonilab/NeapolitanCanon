import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import Chip from '../components/template/components/Chip.jsx';
import ListBox from '../components/template/components/ListBox.jsx';

import Paginator from '../components/template/components/Paginator.jsx';

import { SEARCH_INDEXES, renderFacetLabel } from '../model/INDEXES';

import SearchContext from '../context/searchContext';

const SearchPage = () => {

    // we store the SearchContext into the context const here to be able to
    // use the data and functions stored into the SearchState component
    // which provides the SearchContext.Provider
    const context = useContext(SearchContext);

    const renderLoading = () => {
        return context.isLoading ? 'loading' : null;
    };

    const renderPagination = () => (
        <React.Fragment>
            <h5>Found {context.searchResults.numFound} results, {Math.ceil(context.searchResults.numFound / 100)} pages.</h5>
            <div style={{ float: 'left' }}>
                <Paginator
                    onClickHandler={page => context.selectPage(page - 1)}
                    page={context.searchTerms.page + 1}
                    totalPages={Math.ceil(context.searchResults.numFound / 100)}
                />
            </div>
        </React.Fragment>
    );

    const renderSearchResults = () => {
        return context.searchResults.results.length > 0 ? (
            <React.Fragment>

                {renderPagination()}


                <div style={{ display: 'flex', jusityContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '1em 2em 1em 0', width: '100%' }}>
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
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '1em 0', minWidth: '318px', maxWidth: '318px' }}>
                        {renderFacets()}
                    </div>
                </div>
            </React.Fragment>
        ) : (
                context.searchResults.numFound === 0 && <h3>No results found</h3>
            );
    };

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
                        <Diva manifest={context.selectedResource.id} />
                    </div>

                    <div style={{ padding: '2em', minWidth: '300px', width: '30%', height: 'calc(100vh - 70px)', overflowY: 'auto', margin: '-3.7em -4.5em -4em 2em', borderLeft: '1px solid #eee' }}>
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

    const renderFacets = () => {
        return Object.keys(context.searchResults.facets).map(key => {

            const normalizedFacets = normalizeFacetsResults(context.searchResults.facets[key]);

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
                    {normalizedFacets.map(
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
                                            ? '#eee'
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
                </ListBox>
            );
        });
    };

    const renderForm = () => (
        <form
            onSubmit={context.searchFormSubmitHandler}
            style={{ display: 'flex', jusityContent: 'flext-start' }}
        >
            <Input
                style={{ width: '100%' }}
                className="input__search"
                placeholder="Input your search terms here..."
                value={context.searchTerms.searchKey}
                onChangeHandler={context.searchParamChangeHandler(
                    'searchKey'
                )}
            />
            <Select
                style={{ flex: 1, minWidth: '211px' }}
                value={context.searchTerms.indexes[0]}
                // label="Search by index"
                placeholder="Search by index"
                options={[{ label: 'Full-text', value: '' }].concat(
                    SEARCH_INDEXES
                )}
                onChangeHandler={context.searchParamChangeHandler(
                    'indexes'
                )}
            />
            <PrimaryButton type="submit">search</PrimaryButton>
        </form>
    );

    const renderChips = () => (
        <div style={{ padding: '1em 0' }}>
            {
                context.searchTerms.filters.map(filter => {
                    const filterData = filter.split(':');
                    return (
                        <Chip removeAction={() => context.toggleSearchFilter(filterData[0], filterData[1])} key={filter}>{`${renderFacetLabel(filterData[0])} > ${filterData[1]}`}</Chip>
                    );
                })
            }
        </div>
    );

    return (
        <Template>
            {
                context.selectedResource
                    ? renderDivaWrapper()
                    : (
                        <React.Fragment>
                            {renderForm()}
                            {renderChips()}
                            {renderLoading()}
                            {renderSearchResults()}
                        </React.Fragment>
                    )
            }
        </Template>
    );
};

export default SearchPage;
