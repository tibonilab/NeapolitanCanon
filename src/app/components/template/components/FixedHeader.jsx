import React, { useContext } from 'react';

import './FixedHeader.scss';
import AnalysisContext from '../../../context/analysisContext';

const FixedHeader = ({ children, style }) => {

    const { isContextBarVisible } = useContext(AnalysisContext);

    return (
        <div className="fixedHeader" style={{ ...style, width: `calc(100% - ${isContextBarVisible ? '390' : '70'}px)`, }}>
            {children}
        </div>
    );
};

export default FixedHeader;