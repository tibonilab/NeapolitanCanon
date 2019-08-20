import React from 'react';

import './ButtonGroup.scss';

export const ButtonGroup = ({ children }) => (
    <div className="buttonGroup-root">
        {children}
    </div>
);

export default ButtonGroup;