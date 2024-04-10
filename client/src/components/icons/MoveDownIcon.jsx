import React from 'react';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function MoveDownIcon() {
    return <FontAwesomeIcon icon={faArrowDown} color={'var(--buttonsFontColorOverride, #012452)'} />
}