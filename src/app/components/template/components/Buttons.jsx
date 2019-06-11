import React from 'react';

export const ClearButton = props => <button className={`clearButton-root${props.isActive ? ' clearButton__active' : ''}`}>{props.children}</button>;