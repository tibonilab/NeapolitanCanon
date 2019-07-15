import React from 'react';

import Template from '../components/template/Template.jsx';

import Diva from '../components/wrappers/Diva.jsx';

const Source = ({ match }) => (
    <Template hiddenContextBar>
        <Diva manifest={`${match.params.manifest}.xml`} />
    </Template>
);


export default Source;