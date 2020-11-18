import React, { useContext, useState } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import NapoliContext from '../context/napoliContext';

import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import Collapsible from '../components/template/components/Collapsible.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';

const indexes = () => [
    { value: 'inventory', label: t('common.indexes.inventory') },
    { value: 'composer_names', label: t('common.indexes.composer_names') },
    { value: 'other_names', label: t('common.indexes.other_names') },
    { value: 'original_call_no', label: t('common.indexes.original_call_no') },
    { value: 'call_no', label: t('common.indexes.call_no') },
];

const InventariBrowse = () => {

    const { browseIndex } = useContext(NapoliContext);

    const [selectedIndex, setSelectedIndex] = useStateWithSession('', 'selectedIndex', 'NapoliState');
    const [results, setResults] = useStateWithSession([], 'results', 'NapoliState');
    const [isButtonDisabled, setIsButtonDisabled] = useState(!/\S/.test(selectedIndex), 'isButtonDisabled', 'NapoliState');
    const [buttonLabel, setButtonLabel] = useState(t('browse.form.submit'));
    const [related, setRelated] = useState({});

    const perform = () => {
        setIsButtonDisabled(true);
        setButtonLabel(t('browse.form.submit'));

        const t0 = performance.now();

        setTimeout(() => {
            setResults(browseIndex[selectedIndex]);
            setIsButtonDisabled(false);
            setButtonLabel(t('browse.form.submit'));
            const t1 = performance.now();
            DEBUG && console.log(`perform() performed in ${Math.round(t1 - t0)} milliseconds`);
        }, 500);
    };

    const selectChangeHandler = value => {
        const testValue = /\S/.test(value);
        setIsButtonDisabled(!testValue);
        testValue && setSelectedIndex(value);
    };

    return (
        <Template>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); perform(); }}>
                <FlexWrapper>
                    <Select
                        value={selectedIndex}
                        placeholder={t('browse.form.select_placeholder')}
                        onChangeHandler={selectChangeHandler}
                        options={indexes()}
                    />
                    <PrimaryButton disabled={isButtonDisabled} type="submit">{buttonLabel}</PrimaryButton>
                </FlexWrapper>
            </form>
            {
                results && results.map((element, index) => (
                    <Collapsible key={`${index}_${element.value}`} header={(
                        <h3 className="collapsible-header-caption" style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>
                            {`${element.value.replace(/ *\{[^}]*\} */g, '')}`}
                            <span style={{ float: 'right', color: '#666' }}>{element.related.length}</span>
                        </h3>
                    )} onClickHandler={(collapsed) => {
                        // we use this trick here for rendering performance issues
                        if (!collapsed) {
                            setRelated({ [`${index}_${element.value}`]: results[index].related });
                        } else {
                            setRelated({ [`${index}_${element.value}`]: [] });
                        }
                    }}>
                        {
                            related[`${index}_${element.value}`] && related[`${index}_${element.value}`].map(item => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '.5em', paddingRight: '1em' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', width: 'calc(100% - 100px)' }}>
                                        <div style={{ width: '100px', paddingRight: '1em' }}>
                                            <h5>{item.key}</h5>
                                        </div>
                                        <div style={{ width: 'calc(100% - 200px)' }}>
                                            {item.transcription}
                                        </div>
                                    </div>
                                    <Link to={`/inventario/${item.key}`}>{t('browse.actions.go')}</Link>
                                </div>
                            ))
                        }
                    </Collapsible>
                ))
            }
        </Template >
    );
};

export default InventariBrowse;