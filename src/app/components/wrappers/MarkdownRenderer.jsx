import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { createMarkup } from '../../model/markdownHelper';
import GlobalContext from '../../context/globalContext';

const MarkdownRenderer = ({ filename }) => {
    const { language } = useContext(GlobalContext);

    return (
        <ReactMarkdown source={createMarkup({ filename, language })} escapeHtml={false} />
    );
};

export default MarkdownRenderer;