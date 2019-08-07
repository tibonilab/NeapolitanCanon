import React from 'react';

const ActionButton = ({ children, action, disabled = false }) => {

    const performAction = e => {
        e.preventDefault();

        action && action();
    };

    return (
        <button onClick={performAction} disabled={disabled}>
            {children}
        </button>
    );
};

export default ActionButton;