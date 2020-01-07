import React from 'react';

import Template from '../components/template/Template.jsx';
import MarkdownRenderer from '../components/wrappers/MarkdownRenderer.jsx';

const StaticHtmlPage = ({ match }) => {
    const { filename } = match.params;

    return (
        <Template>
            <MarkdownRenderer filename={filename} />
        </Template>
    );

};

export default StaticHtmlPage;