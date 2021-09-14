import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { ContextBarSelector } from '../shared/ContextBarSelector.jsx';

import AnalysisContext from '../../context/analysisContext';
import NapoliContext from '../../context/napoliContext';

import '../../../index.scss';

import './Template.scss';

const Template = props => {

    const contentClassNames = ['template-content'];

    const { isContextBarVisible, toggleContextBar } = useContext(AnalysisContext);

    const { booted, indexGenerated, invalidDataStore } = useContext(NapoliContext);

    if (!props.hiddenContextBar && isContextBarVisible) {
        contentClassNames.push('template-content__with-contextBar');
    }

    return (
        <div className="template-root">
            <Navbar />
            <Sidebar />
            {/* {
                !props.hiddenContextBar && (
                    <ContextBarSelector
                        visible={isContextBarVisible}
                        toggleBar={toggleContextBar}
                    />
                )
            } */}
            <div className={contentClassNames.join(' ')}>
                {
                    props.location.pathname.includes('browse')
                        ? indexGenerated ? props.children : 'Generazione indice in corso...'
                        : booted
                            ? invalidDataStore
                                ? 'ERRORE: Il file "/public/dataset.json" non è di un formato JSON valido, si prega di informare l\'amministratore di sisitema.'
                                : props.children
                            : 'Caricamento in corso...'
                }
            </div>
        </div >
    );

};

export default withRouter(Template);