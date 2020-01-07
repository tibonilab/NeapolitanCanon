import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

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
            <Link to="/">
                <img src="http://d-lib.rism-ch.org/onstage/images/logo_trans-75-b.png" style={{ maxHeight: '38px' }} />
            </Link>
            <div>
                {
                    language === 'fr'
                        ? <span>français</span>
                        : <a href="#" onClick={changeLanguage('fr')}>français</a>
                } | {
                    language === 'de'
                        ? <span>deutsch</span>
                        : <a href="#" onClick={changeLanguage('de')}>deutsch</a>
                } | {
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