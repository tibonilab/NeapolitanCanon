import React, { useContext } from 'react';

import GlobalContext from '../../../context/globalContext';

export const Navbar = () => {
    const { language, setLanguage } = useContext(GlobalContext);

    const changeLanguage = lang => e => {
        e.preventDefault();
        setLanguage(lang);
        window.location.reload();
    };

    return (
        <div className="navbar-root">
            <img src="http://d-lib.rism-ch.org/onstage/images/logo_trans-75-b.png" style={{ maxHeight: '38px' }} />
            <div>
                {
                    language === 'en'
                        ? <span>english</span>
                        : <a href="#" onClick={changeLanguage('en')}>english</a>
                } | {
                    language === 'it'
                        ? <span>italiano</span>
                        : <a href="#" onClick={changeLanguage('it')}>italiano</a>
                }
            </div>
        </div>
    );
};