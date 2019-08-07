import React from 'react';

import './FixedHeader.scss';

const FixedHeader = ({ children, style }) => (
    <div className="fixedHeader" style={style}>
        {children}
    </div>
);

export default FixedHeader;