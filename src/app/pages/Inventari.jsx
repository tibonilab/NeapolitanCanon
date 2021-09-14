import React, { useContext, useState } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import NapoliContext from '../context/napoliContext';

import Input from '../components/form/Input.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import ActionLink from '../components/template/components/ActionLink.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';

const getHighlightedText = (text, highlight) => {
    // console.log(text, highlight);
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> {parts.map((part, i) =>
        <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { background: 'yellow' } : {}}>
            {part}
        </span>)
    } </span>;
};

const Inventari = () => {

    const [searchTerm, setSearchTerm] = useStateWithSession('', 'searchTerm', 'NapoliState');
    const [highlightTerm, setHighlightTerm] = useStateWithSession('', 'highlightTerm', 'NapoliState');

    const { searchResults, fullTextSearch } = useContext(NapoliContext);

    return (
        <Template>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); fullTextSearch(searchTerm); setHighlightTerm(searchTerm); }}>
                <FlexWrapper>
                    <Input
                        style={{ width: '100%' }}
                        className="input__search"
                        placeholder={t('search.form.search_placeholder')}
                        value={searchTerm}
                        onChangeHandler={setSearchTerm}
                    />
                    <PrimaryButton type="submit" disabled={!/\S/.test(searchTerm)}>{t('search.form.submit')}</PrimaryButton>
                </FlexWrapper>
            </form>
            <div style={{ marginBottom: '2em' }}>
                <h5>{t('search.nav.count', { count: Object.keys(searchResults).length || 0 })} </h5>
            </div>
            {
                searchResults && Object.keys(searchResults).map(key => (


                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '.5em' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: 'calc(100% - 100px)' }}>
                            <div style={{ width: '100px', paddingRight: '1em' }}>
                                <h5>{key}</h5>
                            </div>
                            <div style={{ width: 'calc(100% - 200px)' }}>
                                {getHighlightedText(searchResults[key].transcription, highlightTerm)}
                            </div>
                        </div>
                        <Link to={`/inventario/${key}`}>{t('search.actions.go')}</Link>
                    </div>


                ))
            }
        </Template >
    );
};

export default Inventari;