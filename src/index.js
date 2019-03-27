import React from 'react';
import ReactDOM from 'react-dom';

import Router from './app/Router.jsx';

const App = () => <Router />;

ReactDOM.render(
    <App />,
    document.getElementById('root')
);