import React from 'react';

import { Link, withRouter } from 'react-router-dom';

import { SearchIcon, BrowseIcon, PinIcon } from './Icons.jsx';
import { ClearButton } from './Buttons.jsx';

const SidebarWithRoute = props => {

    const isActive = (path) => props.location.pathname.includes(path);
    const isRoot = () => props.location.pathname === '/';

    return (
        <div className="sidebar-root">
            <Link to="/search">
                <ClearButton isActive={isRoot() || isActive('search')}>
                    <SearchIcon />
                </ClearButton>
            </Link>

            <Link to="/browse">
                <ClearButton isActive={isActive('browse')}>
                    <BrowseIcon />
                </ClearButton>
            </Link>

            <Link to="/pin">
                <ClearButton isActive={isActive('pin')}>
                    <PinIcon />
                </ClearButton>
            </Link>
        </div>
    );
};

export const Sidebar = withRouter(SidebarWithRoute);