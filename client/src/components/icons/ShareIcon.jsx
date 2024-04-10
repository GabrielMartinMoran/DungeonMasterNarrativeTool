import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';

export function ShareIcon() {
    return <FontAwesomeIcon icon={faShareNodes} color={'var(--buttonsFontColorOverride, #424242)'} />
}