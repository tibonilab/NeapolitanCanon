import React, { useContext } from 'react';

import Template from '../components/template/Template.jsx';
import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import Chip from '../components/template/components/Chip.jsx';

import Paginator from '../components/template/components/Paginator.jsx';

import FacetsSelector from '../components/shared/FacetsSelector/FacetsSelector.jsx';
import SearchResults from '../components/shared/SearchResults.jsx';
import PaginationHeader from '../components/shared/PaginationHeader.jsx';

import { generateSearchIndexes, renderFacetLabel } from '../model/INDEXES';

import SearchContext from '../context/searchContext';
import AnalysisContext from '../context/analysisContext';

import { t } from '../i18n';

const SearchPage = () => {

    // we store the SearchContext into the context const here to be able to
    // use the data and functions stored into the SearchState component
    // which provides the SearchContext.Provider
    const searchContext = useContext(SearchContext);
    const analysisContext = useContext(AnalysisContext);

    const totalPages = Math.ceil(searchContext.searchResults.numFound / 100);

    const renderLoading = () => {
        return searchContext.isLoading ? 'loading' : null;
    };

    const renderSearchResults = () => {
        return searchContext.searchResults.results.length > 0 ? (
            <React.Fragment>

                <div style={{ display: 'flex', jusityContent: 'space-between', width: '100%' }}>
                    <div style={{ padding: '1em 2em 1em 0', width: '100%' }}>
                        <SearchResults {...searchContext} {...analysisContext} />
                    </div>
                    <div style={{ padding: '1em 0', minWidth: '318px', maxWidth: '318px' }}>
                        <FacetsSelector {...searchContext} />
                    </div>
                </div>
                <Paginator
                    onClickHandler={page => searchContext.selectPage(page - 1)}
                    page={searchContext.searchTerms.page + 1}
                    totalPages={totalPages}
                />

            </React.Fragment>
        ) : (
            !searchContext.isLoading && searchContext.searchResults.numFound === 0 && <h3>{t('search.noResults')}</h3>
        );
    };

    const renderDivaWrapper = () => {
        const element = searchContext.selectedResource;

        return (
            <React.Fragment>
                <a
                    href="#"
                    onClick={e => {
                        e.preventDefault();
                        searchContext.unsetSearchSelected();
                    }}
                >
                    {t('search.actions.back')}
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
        <div
            onSubmit={searchContext.searchFormSubmitHandler}
            style={{
                position: 'fixed',
                margin: '-2em -4em',
                width: `calc(100% - ${analysisContext.isContextBarVisible ? '390' : '70'}px)`,
                background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 85%,rgba(255,255,255,0) 100%)',
                padding: '2em 4em',
                transition: 'width .25s ease-in-out'
            }}
        >
            <form style={{
                display: 'flex',
                jusityContent: 'flext-start',
            }}>

                <Input
                    style={{ width: '100%' }}
                    className="input__search"
                    placeholder={t('search.form.search_placeholder')}
                    value={searchContext.searchTerms.searchKey}
                    onChangeHandler={searchContext.searchParamChangeHandler('searchKey')}
                />
                <Select
                    style={{ flex: 1, minWidth: '211px' }}
                    value={searchContext.searchTerms.indexes[0]}
                    placeholder={t('search.form.select_placeholder')}
                    options={[{ label: 'Full-text', value: '' }].concat(generateSearchIndexes())}
                    onChangeHandler={searchContext.searchParamChangeHandler('indexes')}
                />
                <PrimaryButton type="submit">{t('search.form.submit')}</PrimaryButton>

            </form>
            {renderChips()}
            <PaginationHeader {...searchContext} />
        </div>
    );

    const renderChips = () => (
        <React.Fragment>
            {
                searchContext.searchTerms.filters.length > 0 ? (
                    <div style={{ padding: '.5em 0' }}>
                        {
                            searchContext.searchTerms.filters.map(filter => {
                                const filterData = filter.split(':');
                                return (
                                    <Chip removeAction={() => searchContext.toggleSearchFilter(filterData[0], filterData[1])} key={filter}>{`${renderFacetLabel(filterData[0])} > ${filterData[1]}`}</Chip>
                                );
                            })
                        }
                    </div>

                ) : null
            }
        </React.Fragment>
    );

    return (
        <Template>
            {
                searchContext.selectedResource
                    ? renderDivaWrapper()
                    : (
                        <React.Fragment>
                            {renderForm()}
                            <div style={{ marginTop: searchContext.searchTerms.filters.length > 0 ? '9.5em' : '6.5em' }}>
                                {renderLoading()}
                                {renderSearchResults()}
                            </div>
                        </React.Fragment>
                    )
            }
        </Template>
    );
};

export default SearchPage;
