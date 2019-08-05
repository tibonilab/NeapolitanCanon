import { useState, useEffect } from 'react';

const KEY_SUFFIX = '-service-storage';

/**
 * This is an extended version of native useState Hook of React, it keeps a copy 
 * of the state into window sessionStorage
 * 
 * It is useful when we want to be sure to keep data through window refreshes.
 *
 * @param {*} initialValue 
 * @param {String} key 
 */
export const useStateWithSession = (initialValue, key) => {

    const storage = window.sessionStorage;
    const storageKey = key + KEY_SUFFIX;

    const readDataFromSession = () => {
        return storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey));
    };

    const writeDataIntoSession = data => {
        storage.setItem(storageKey, JSON.stringify(data));
    };

    const readDataOrUseInitialValue = () => {
        let value = initialValue;

        const sessionValue = readDataFromSession();

        if (sessionValue != null) {
            return sessionValue;
        }

        return value;
    };

    const [data, setData] = useState(readDataOrUseInitialValue());

    // we use useEffect to update data into sessionStorage when data changes
    useEffect(() => writeDataIntoSession(data), [data]);

    return [
        data,
        setData
    ];
};

export default useStateWithSession;