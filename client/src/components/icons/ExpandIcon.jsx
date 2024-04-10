import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ExpandIcon() {
    return <FontAwesomeIcon icon={faPlus} color={'var(--buttonsFontColorOverride, #424242)'} />
}