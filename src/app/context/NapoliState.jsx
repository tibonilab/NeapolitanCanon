import React, { useEffect, useState } from 'react';

import RestClient from '../service/RestClient';

import { useStateWithSession } from '../service/serviceStorage';


import NapoliContext from './napoliContext';

const SESSION_PREFIX = 'NapoliState';

const indexes = [
    { value: 'inventory', label: 'Inventory' },
    { value: 'composer_names', label: 'Composers names' },
    { value: 'other_names', label: 'Other names' },
    { value: 'original_call_no', label: 'Original call number' },
    { value: 'call_no', label: 'Call number' },
];

const sortingHandler = (a, b) => {
    var nameA = a.value && a.value.toUpperCase().replace(['[', ']'], ''); // ignore upper, lowercase and squared paranthesis
    var nameB = b.value && b.value.toUpperCase().replace(['[', ']'], ''); // ignore upper, lowercase and squared paranthesis

    if (nameA < nameB) {
        return -1;
    }

    if (nameA > nameB) {
        return 1;
    }

    return 0;
};

const getRelated = (dataStore, selectedIndex, value) => {
    const t0 = performance.now();

    const related = [];

    Object.keys(dataStore).forEach(key => {
        // push only perfect matches for "inventory" index
        if (selectedIndex === 'inventory') {
            dataStore[key][selectedIndex] && dataStore[key][selectedIndex] == value && related.push({ ...dataStore[key], key });
        }
        else {
            // check if current index has multiple values (separated by ";)... 
            if (dataStore[key][selectedIndex] && dataStore[key][selectedIndex].includes(';')) {
                // ...in this case we want to push value if it's included...
                dataStore[key][selectedIndex] && dataStore[key][selectedIndex].includes(value) && related.push({ ...dataStore[key], key });
            } else {
                // ... otherwise we pash perfect matches only
                dataStore[key][selectedIndex] && dataStore[key][selectedIndex] == value && related.push({ ...dataStore[key], key });
            }
        }
    });

    const t1 = performance.now();
    DEBUG && console.log(`getRelated() performed in ${Math.round(t1 - t0)} milliseconds`);

    return related;
};

const getUniqueElementsByIndex = (dataStore, selectedIndex) => {
    const t0 = performance.now();

    const elements = [];

    Object.keys(dataStore).map(index =>
        dataStore[index][selectedIndex] && dataStore[index][selectedIndex]
            .split('; ')
            .forEach(value => {
                elements.some(e => e.value === value) || elements.push({ value, related: getRelated(dataStore, selectedIndex, value) });
            })
    );

    elements.sort(sortingHandler);

    const t1 = performance.now();
    DEBUG && console.log(`getUniqueElementsByIndex() performed in ${Math.round(t1 - t0)} milliseconds`);

    return elements;
};

const NapoliState = props => {

    const [dataStore, setDataStore] = useStateWithSession(false, 'dataStore', SESSION_PREFIX);
    const [searchResults, setSearchResults] = useStateWithSession({}, 'searchResults', SESSION_PREFIX);
    const [browseIndex, setBrowseIndex] = useState({});

    const [booted, setBooted] = useState(false);
    const [indexGenerated, setIndexGenerated] = useState(false);

    const generateIndexFromDataStore = dataStore => {

        const browseIndex = {};

        indexes.forEach(selectedIndex => {
            browseIndex[selectedIndex.value] = getUniqueElementsByIndex(dataStore, selectedIndex.value);
        });
        setBrowseIndex(browseIndex);
        setIndexGenerated(true);
        setBooted(true);
    };

    const fetchDataStore = () => {
        if (!dataStore) {
            RestClient
                .get({ url: '/public/inventari-di-napoli.json' })
                .then(dataStore => {

                    let filteredDataStore = {};

                    Object.keys(dataStore).forEach(key => {
                        const inventory = key.split('-')[0];

                        if (inventory != '1827') {
                            filteredDataStore[key] = dataStore[key];
                        }
                    });

                    setDataStore(filteredDataStore);
                    generateIndexFromDataStore(filteredDataStore);
                });
        } else {
            generateIndexFromDataStore(dataStore);
        }

    };

    const fullTextSearch = (term) => {
        const t0 = performance.now();
        const subset = {};
        const lowerCaseTerm = term.toLowerCase();

        const lowerCaseDataSet = JSON.parse(JSON.stringify(dataStore).toLowerCase());

        Object.keys(dataStore)
            .forEach(index => Object.keys(dataStore[index])
                .forEach(field => {
                    if (
                        lowerCaseDataSet[index][field] &&
                        lowerCaseDataSet[index][field].indexOf(lowerCaseTerm) !== -1 &&
                        !subset[index]
                    ) {
                        subset[index] = dataStore[index];
                    }
                })
            );

        setSearchResults(subset);

        const t1 = performance.now();
        DEBUG && console.log(`found ${Object.keys(subset).length} results for "${term}" in ${Math.round(t1 - t0)} milliseconds`, subset);
        return subset;
    };

    useEffect(fetchDataStore, []);

    return (
        <NapoliContext.Provider
            value={{
                booted,
                indexGenerated,
                dataStore,
                fullTextSearch,
                searchResults,
                browseIndex
            }}
        >
            {props.children}
        </NapoliContext.Provider>
    );
};

export default NapoliState;