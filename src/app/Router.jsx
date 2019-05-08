import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Index from './pages/Index.jsx';

import SearchState from './context/SearchState.jsx';
import BrowseState from './context/BrowseState.jsx';

const Router = () => (
    <BrowserRouter>
        <SearchState>
            <Route path="/search" component={Search} />
        </SearchState>
        <BrowseState>
            <Route path="/browse" component={Browse} />
        </BrowseState>
        <Route path="/" exact component={Index} />
    </BrowserRouter>
);

export default Router;