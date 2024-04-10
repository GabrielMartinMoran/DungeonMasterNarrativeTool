import React from 'react';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CollapseIcon() {
    return <FontAwesomeIcon icon={faMinus} color={'var(--buttonsFontColorOverride, #424242)'}/>
}