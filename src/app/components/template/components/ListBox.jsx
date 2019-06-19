import React, { useState } from 'react';

import './ListBox.scss';


const ListBox = props => {

    const [collapsed, setCollapsed] = useState(false);

    const classNames = ['listBox-root'];

    if (collapsed) {
        classNames.push('listBox__collapsed');
    }

    return (
        <div className={classNames.join(' ')}>
            <div className="listBox-header" onClick={() => setCollapsed(!collapsed)}>
                {props.header}
            </div>

            <div className="listBox-body">
                {props.children}
            </div>

        </div>
    );
};

export default ListBox;