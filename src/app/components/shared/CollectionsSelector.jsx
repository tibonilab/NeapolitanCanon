import React from 'react';

import Checkbox from '../form/Checkbox.jsx';

import { COLLECTIONS } from '../../model/INDEXES';

const CollectionSelector = ({ onChangeHandler, ...props }) => {
    const { collections } = props;

    return COLLECTIONS.map(element => (
        <div key={element.field}>
            <label>
                <Checkbox 
                    onChangeHandler={checked => {
                        if (checked) {
                            onChangeHandler(collections.concat(element.field));
                        } else {
                            onChangeHandler(collections.filter(e => e !== element.field));
                        }
                    }}
                    value={element.field} 
                    name="collection_s" 
                    checked={collections.includes(element.field)}
                />
                {element.label}
            </label>
        </div>
    ));
};

export default CollectionSelector;