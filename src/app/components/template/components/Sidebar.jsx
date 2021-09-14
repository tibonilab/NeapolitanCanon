import React, { useContext } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { SearchIcon, BrowseIcon, PinIcon, BookIcon } from './Icons.jsx';
import { ClearButton } from './Buttons.jsx';
import AnalysisContext from '../../../context/analysisContext';

import BrowseContext from '../../../context/browseContext';
import SearchContext from '../../../context/searchContext';

const SidebarWithRoute = props => {

    const isActive = (path) => props.location.pathname.includes(path);

    const { pinnedDocuments } = useContext(AnalysisContext);
    const browseContext = useContext(BrowseContext);
    const searchContext = useContext(SearchContext);

    return (
        <div className="sidebar-root">
            <Link onClick={() => { searchContext.unsetSearchSelected ? searchContext.unsetSearchSelected() : false; }} to="/inventari">
                <ClearButton isActive={isActive('inventari')}>
                    <SearchIcon />
                </ClearButton>
            </Link>

            <Link onClick={() => { browseContext.unsetSearchResults ? browseContext.unsetSearchResults() : false; browseContext.unsetSearchSelected ? browseContext.unsetSearchSelected() : false; }} to="/browse">
                <ClearButton isActive={isActive('browse')}>
                    <BrowseIcon />
                </ClearButton>
            </Link>

            <Link to="/page/consulta">
                <ClearButton isActive={isActive('consulta')}>
                    <BookIcon />
                </ClearButton>
            </Link>

            {/* <Link to="/pin">
                <ClearButton isActive={isActive('pin')}>
                    {pinnedDocuments.length > 0 && <span className="badge">{pinnedDocuments.length}</span>}
                    <PinIcon />
                </ClearButton>
            </Link> */}
        </div>
    );
};

export const Sidebar = withRouter(SidebarWithRoute);