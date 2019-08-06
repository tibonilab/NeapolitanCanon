import React from 'react';

import Template from '../components/template/Template.jsx';

const StaticHtmlPage = ({ match }) => {

    const createMarkup = () => {
        const { filename } = match.params;

        try {
            const importedDOM = require(`../../../static/${filename}.html`);
            return ({ __html: importedDOM });

        } catch (e) {
            return ({ __html: '<div>404 not found</div>' });
        }

    };

    return (
        <Template>
            <div dangerouslySetInnerHTML={createMarkup()} />
        </Template>
    );

};

export default StaticHtmlPage;