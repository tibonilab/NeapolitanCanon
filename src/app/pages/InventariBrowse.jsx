import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import NapoliContext from '../context/napoliContext';

import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import Collapsible from '../components/template/components/Collapsible.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';

const indexes = [
    { value: 'inventory', label: 'Inventory' },
    { value: 'composer_names', label: 'Composers names' },
    { value: 'other_names', label: 'Other names' },
    { value: 'original_call_no', label: 'Original call number' },
    { value: 'call_no', label: 'Call number' },
];

const InventariBrowse = () => {

    const { browseIndex } = useContext(NapoliContext);

    const [selectedIndex, setSelectedIndex] = useState('inventory');
    const [results, setResults] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [buttonLabel, setButtonLabel] = useState(t('browse.form.submit'));
    const [related, setRelated] = useState({});

    const perform = () => {
        setIsButtonDisabled(true);
        setButtonLabel('Caricamento..');

        const t0 = performance.now();

        setTimeout(() => {
            setResults(browseIndex[selectedIndex]);
            setIsButtonDisabled(false);
            setButtonLabel(t('browse.form.submit'));
            const t1 = performance.now();
            DEBUG && console.log(`perform() performed in ${Math.round(t1 - t0)} milliseconds`);
        }, 10);

    };

    return (
        <Template>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); perform(); }}>
                <FlexWrapper>
                    <Select
                        value={selectedIndex}
                        onChangeHandler={setSelectedIndex}
                        options={indexes}
                    />
                    <PrimaryButton disabled={isButtonDisabled} type="submit">{buttonLabel}</PrimaryButton>
                </FlexWrapper>
            </form>
            {
                results && results.map((element, index) => (
                    <Collapsible key={`${index}_${element.value}`} header={(
                        <h3 style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>
                            {`${element.value.replace(/ *\{[^}]*\} */g, '')}`}
                            <span style={{ float: 'right' }}>{element.related.length}</span>
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
                                    <Link to={`/inventario/${item.key}`}>Go</Link>
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