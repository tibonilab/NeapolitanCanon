import React, {
    useContext, useState
} from 'react';
import { Link } from 'react-router-dom';
import Template from '../components/template/Template.jsx';

import NapoliContext from '../context/napoliContext';

import { useStateWithSession } from '../service/serviceStorage';

import ActionLink from '../components/template/components/ActionLink.jsx';

import { PrimaryButtonSmall } from '../components/template/components/Buttons.jsx';

import Diva from '../components/wrappers/Diva.jsx';

const Consulta = ({ match }) => {

    const { dataStore, booted } = useContext(NapoliContext);

    const [currentPage, setCurrentPage] = useStateWithSession(0, 'currentPage', 'NapoliState');

    const [inited, setInited] = useState(false);


    const { inventory, page = 0 } = match.params;
    const inventories = [...new Set(Object.keys(dataStore).map(key => dataStore[key].inventory))].sort();

    let view;

    if (inventory) {
        const elements = [];

        Object.keys(dataStore).forEach(key => dataStore[key].inventory == inventory && elements.push(dataStore[key]));

        if (!inited && currentPage != page) { setCurrentPage(parseInt(page, 10)); setInited(true); }

        const pagesCount = elements.map(e => parseInt(e.page, 10)).reduce((a, b) => Math.max(a, b), 0);

        const pageElements = elements.filter(e => parseInt(e.page, 10) == currentPage);
        view = (
            <div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <div style={{ width: '60%', marginRight: '2em' }}>
                        <Diva
                            manifest={`pyr_${inventory}.json`}
                            onScrollHandler={setCurrentPage}
                            initialPage={page}
                            currentPage={currentPage}
                        />
                    </div>
                    <div style={{ width: '40%' }}>
                        <div style={{ marginBottom: '1em' }}>
                            <h3>
                                Inventory {inventory}
                                <span style={{ fontSize: '80%', float: 'right', color: '#666' }}>
                                    <PrimaryButtonSmall disabled={currentPage == 0} action={() => setCurrentPage(currentPage - 1)}>{'<<'}</PrimaryButtonSmall>
                                    <span style={{ fontSize: '80%', margin: '0 3px', borderRadius: '.25rem', padding: '.5em 1em', color: '#fff', fontWeight: 900, background: '#00b5d6' }}>{`Page ${currentPage + 1}/${pagesCount + 1}`}</span>
                                    <PrimaryButtonSmall disabled={currentPage == pagesCount} action={() => setCurrentPage(currentPage ? currentPage + 1 : 1)}>{'>>'}</PrimaryButtonSmall>
                                </span>
                            </h3>
                        </div>
                        {
                            pageElements.length > 0
                                ? (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1em' }}>
                                            <div style={{ marginRight: '2em' }}>
                                                <h5>Item</h5>
                                            </div>
                                            <div style={{ marginRight: '1em' }}>
                                                <h5>Transcription</h5>
                                            </div>
                                        </div>
                                        {
                                            pageElements.map(e => (
                                                <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '.7em', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <div style={{ marginRight: '2em' }}><h5>{`${e.id}`}</h5></div>
                                                        <div style={{ marginRight: '1em' }}>{e.transcription}</div>
                                                    </div>
                                                    <Link to={`/inventario/${e.inventory}-${e.id}`}>Go</Link>
                                                </div>
                                            ))
                                        }
                                    </div>)
                                : (<div><h5>No transcriptions found</h5></div>)
                        }
                    </div>
                </div>
            </div>
        );
    } else {
        currentPage && setCurrentPage(null);
        view = (
            <div>
                <h3>choose inventory</h3>
                {inventories.map(e => <div key={e}><Link to={`/consulta/${e}`}>{e}</Link></div>)}
            </div>
        );
    }

    return (
        <Template>
            {view}
        </Template>
    );
};

export default Consulta;