import React from 'react';
import { Link } from 'react-router-dom';

import '../../../index.scss';

const Template = props => {

    return (
        <div className="template-root">
            <div style={{ float: 'right' }}>
                <Link to="/search">Search</Link> or <Link to="/browse">Browse</Link>
            </div>
            {props.children}
        </div>
    );

};

export default Template;