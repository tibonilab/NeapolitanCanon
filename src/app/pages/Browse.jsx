import React, { useContext } from 'react';

import { normalizeFacetsResults } from '../model/Solr';

import Template from '../components/template/Template.jsx';
import Select from '../components/form/Select.jsx';
import Input from '../components/form/Input.jsx';
import CollectionsSelector from '../components/shared/CollectionsSelector.jsx';
import DateRangePicker from '../components/form/DateRangePicker.jsx';

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
                                        <div key={element.id}>
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

                <h4>Collections</h4>
                <CollectionsSelector
                    collections={context.browseTerms.collections}
                    onChangeHandler={context.changeCollectionsSelectorHandler}
                />

                <h4>Index Prefix</h4>
                <Input
                    value={context.browseTerms.facets.prefix}
                    placeholder="prefix"
                    onChangeHandler={context.onPrefixFilterChangeHandler}
                />

                <h4>Date range</h4>
                <DateRangePicker
                    from={context.browseTerms.dateRange.from}
                    to={context.browseTerms.dateRange.to}
                    onChangeHandler={context.onDateRangeChangeHandler}
                    minFrom={1826}
                    maxTo={2016}
                />
            </form>

            <div style={{ padding: '1em 0' }}>
                {renderLoading()}
                {renderBrowseResults()}
            </div>
        </Template>
    );
};

export default BrowsePage;