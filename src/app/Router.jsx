import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Index from './pages/Index.jsx';

import SearchState from './context/SearchState.jsx';
import BrowseState from './context/BrowseState.jsx';
import AnalysisState from './context/AnalysisState.jsx';

const Router = () => (
    <BrowserRouter>
        <AnalysisState>
            <SearchState>
                <Route path="/search" component={Search} />
            </SearchState>
            <BrowseState>
                <Route path="/browse" component={Browse} />
            </BrowseState>
            <Route path="/" exact component={Index} />
        </AnalysisState>
    </BrowserRouter>
);

export default Router;