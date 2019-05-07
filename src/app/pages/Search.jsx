import React, { Component } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';

import Input from '../components/form/Input.jsx';
import Select from '../components/form/Select.jsx';
import DateRangePicker from '../components/form/DateRangePicker.jsx';
import CollectionsSelector from '../components/shared/CollectionsSelector.jsx';
import Diva from '../components/wrappers/Diva.jsx';

import { SEARCH_INDEXES } from '../model/INDEXES';

import GlobalContext from '../context/globalContext';

class Search extends Component {

    // init of the context, we can now consume context data and functions into the component's methods via this.context
    static contextType = GlobalContext;

    renderLoading() {
        return this.context.search.loading ? 'loading' : null;
    }

    renderSearchResults() {

        return this.context.search.results.length > 0 ? (
            <div style={{display:'flex', jusityContent: 'flext-start'}}>
                <div style={{padding: '2em 0', width: '300px'}}>
                    <h3>Facets</h3>
                    {this.renderFacets()}
                </div>
                <div style={{padding: '2em'}}>
                    <h3>Found {this.context.search.numFound} results.</h3>
                    {
                        this.context.search.results.map(element => (
                            <div key={element.id} style={{cursor: 'pointer'}} onClick={() => this.context.setSearchSelected(element)}>
                                <br />
                                <h2>{element.title_s}</h2> 
                                <h3>{element.place_s} - {element.year_i}</h3>
                                <div style={{display:'none'}}>
                                    { 
                                        element.composer_ss && (
                                            <div>
                                                <h4>Composers</h4>
                                                {
                                                    element.composer_ss.map((composer, index) => <div key={index}>{composer}</div>)
                                                }
                                            </div>
                                        )
                                    }
                                    { 
                                        element.interpreter_ss && (
                                            <div style={{paddingLeft: '2em'}}>
                                                <h4>Interpreters</h4>
                                                {
                                                    element.interpreter_ss.map((interpreter, index) => <div key={index}>{interpreter}</div>)
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        ) : (
            this.context.search.numFound === 0 && <h3>No results found</h3>
        );
    }

    renderDivaWrapper() {
        return (
            <div>
                <a href="#" onClick={(e) => {e.preventDefault(); this.context.unsetSearchSelected();}}>close</a>
                <Diva manifest={this.context.search.selected.id} />
            </div>
        );
    }

    renderFacets() {
        return Object.keys(this.context.search.facets).map(key => (
            <div key={key}>
                <br />
                <h4>{key}</h4>
                {normalizeFacetsResults(this.context.search.facets[key]).map((facet, index) => index < 10 && <div style={{display: 'flex', justifyContent:'space-between',cursor: 'pointer', background: this.context.search.searchTerms.filters.includes(`${key}:${facet.label}`) ? 'red' : 'transparent'}} key={index} onClick={() => this.context.toggleSearchFilter(key, facet.label)}>
                    <span>{facet.label}</span> 
                    <span>{facet.count}</span>
                </div>)}
            </div>
        ));
    }

    render() {

        return (
            <Template>
                <GlobalContext.Consumer>
                    {context => (
                        <React.Fragment>

                            <h4>Search</h4>

                            <form onSubmit={context.searchFormSubmitHandler} style={{display:'flex', jusityContent: 'flext-start'}}>
                                <Input 
                                    onChangeHandler={context.searchParamChangeHandler('searchKey')} 
                                />
                                <button type="submit">search</button>
                            </form>


                            <div>
                                <h4>Advanced</h4>
                                <Select 
                                    label="Search by index"
                                    placeholder="Select index"
                                    options={[{ label: 'Full-text', value: '' }].concat(SEARCH_INDEXES)}
                                    onChangeHandler={context.searchParamChangeHandler('indexes')}
                                />
                    
                                <div>
                                    <h4>Collections</h4>
                                    <CollectionsSelector 
                                        collections={context.search.searchTerms.collections}
                                        onChangeHandler={context.changeStateCollectionsSelector}
                                    />
                                </div>

                                <div>
                                    <h4>Date range</h4>
                                    <DateRangePicker 
                                        onChangeHandler={context.searchParamChangeHandler('dateRange')}
                                        minFrom={1826}
                                        maxTo={2016}
                                    />
                                </div>

                            </div>

                            <div style={{padding: '1em 0'}}>
                                {this.renderLoading()}
                                { context.search.selected ? this.renderDivaWrapper() : this.renderSearchResults() }
                            </div>
                        </React.Fragment>
                    )}
                </GlobalContext.Consumer>
            </Template>
        );
    }
}

export default Search;