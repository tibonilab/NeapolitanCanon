import React, { useContext } from 'react';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import AnalysisContext from '../context/analysisContext';

const PinnedPage = props => {

    const { pinnedDocuments, togglePinnedDocument } = useContext(AnalysisContext);

    return (
        <Template>
            <h3>You have pinned {pinnedDocuments.length} documents</h3>
            {pinnedDocuments.map(element => (
                <div
                    key={element.id}
                    style={{ cursor: 'pointer', paddingBottom: '1em', borderBottom: '1px solid #efefef', marginTop: '1em' }}
                // onClick={() => context.setSearchSelected(element)}
                >
                    <Link to={`/source/${element.id.replace('.xml', '')}`}>

                        <b>{element.title_s}</b>
                    </Link>
                    <p>
                        {element.place_s} - {element.year_i}
                    </p>
                    <button onClick={e => {
                        e.preventDefault();
                        togglePinnedDocument(element);
                    }}>
                        Remove from pinned
                    </button>
                </div>
            ))}
        </Template>
    );

};

export default PinnedPage;