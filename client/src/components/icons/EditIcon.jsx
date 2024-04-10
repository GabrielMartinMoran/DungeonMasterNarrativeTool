import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function EditIcon() {
    return <FontAwesomeIcon icon={faEdit} color={'var(--buttonsFontColorOverride, #574a6b)'} />
}