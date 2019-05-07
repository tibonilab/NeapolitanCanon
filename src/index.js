import React from 'react';
import ReactDOM from 'react-dom';

import Router from './app/Router.jsx';
import GlobalState from './app/context/GlobalState.jsx';

const App = () => (
    <GlobalState>
        <Router />
    </GlobalState>
);

ReactDOM.render(
    <App />,
    document.getElementById('root')
);