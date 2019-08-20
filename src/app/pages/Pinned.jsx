import React, { useContext } from 'react';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';
import ActionButton from '../components/template/components/ActionButton.jsx';

import AnalysisContext from '../context/analysisContext';

import { t } from '../i18n';

const PinnedPage = () => {

    const { pinnedDocuments, togglePinnedDocument, removeAllPinnedDocuments } = useContext(AnalysisContext);

    const removeAll = () => {
        confirm('Are you sure?') && removeAllPinnedDocuments();
    };

    return (
        <Template>
            <h3>
                {
                    pinnedDocuments.length > 0
                        ? t('pinned.header', { count: pinnedDocuments.length })
                        : t('pinned.noPins')
                }
            </h3>
            {pinnedDocuments.length > 0 && <ActionButton action={removeAll}>Remove all</ActionButton>}
            {pinnedDocuments.map(element => (
                <div
                    key={element.id}
                    style={{ paddingBottom: '1em', borderBottom: '1px solid #efefef', marginTop: '1em' }}
                >
                    <Link to={`/source/${element.id.replace('.xml', '')}`}>
                        <b>{element.title_s}</b>
                    </Link>
                    <p>
                        {element.place_s} - {element.year_i}
                    </p>
                    <ActionButton action={() => togglePinnedDocument(element)}>
                        {t('search.actions.unpin')}
                    </ActionButton>
                </div>
            ))}
        </Template>
    );

};

export default PinnedPage;