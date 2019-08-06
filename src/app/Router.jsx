import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Search from './pages/Search.jsx';
import Source from './pages/Source.jsx';
import Browse from './pages/Browse.jsx';
import Pinned from './pages/Pinned.jsx';
import StaticHtml from './pages/StaticHtml.jsx';
import Index from './pages/Index.jsx';

import SearchState from './context/SearchState.jsx';
import BrowseState from './context/BrowseState.jsx';
import AnalysisState from './context/AnalysisState.jsx';

const Router = () => (
    <BrowserRouter>
        <AnalysisState>
            <SearchState>
                <Route path="/search" component={Search} />
                <BrowseState>
                    <Route path="/browse" component={Browse} />
                </BrowseState>
            </SearchState>
            <Route path="/pin" component={Pinned} />
            <Route path="/source/:manifest" component={Source} />
            <Route path="/page/:filename" component={StaticHtml} />
            <Route path="/" exact component={Index} />
        </AnalysisState>
    </BrowserRouter>
);

export default Router;