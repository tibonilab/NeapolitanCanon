import React, { useContext } from 'react';

import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { ContextBarSelector } from '../shared/ContextBarSelector.jsx';

import AnalysisContext from '../../context/analysisContext';

import '../../../index.scss';

import './Template.scss';

const Template = props => {

    const contentClassNames = ['template-content'];

    const { isContextBarVisible, toggleContextBar } = useContext(AnalysisContext);

    if (!props.hiddenContextBar && isContextBarVisible) {
        contentClassNames.push('template-content__with-contextBar');
    }

    return (
        <div className="template-root">
            <Navbar />
            <Sidebar />
            {
                !props.hiddenContextBar && (
                    <ContextBarSelector
                        visible={isContextBarVisible}
                        toggleBar={toggleContextBar}
                    />
                )
            }
            <div className={contentClassNames.join(' ')}>
                {props.children}
            </div>
        </div >
    );

};

export default Template;