import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CreateIcon() {
    return <FontAwesomeIcon icon={faPlus} color={'var(--buttonsFontColorOverride, #2b3340)'} />
}