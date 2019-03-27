import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Index from './pages/Index.jsx';

const Router = () => (
    <BrowserRouter>
        <Route path="/search" component={Search} />
        <Route path="/browse" component={Browse} />
        <Route path="/" exact component={Index} />
    </BrowserRouter>
);

export default Router;