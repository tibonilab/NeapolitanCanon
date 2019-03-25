import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import Index from './components/Index.jsx';

const Router = () => (
    <BrowserRouter>
        <Route path="/" component={Index} />
    </BrowserRouter>
);

export default Router;