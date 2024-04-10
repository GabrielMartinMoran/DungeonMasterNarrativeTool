import React from 'react';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CopyLinkIcon() {
    return <FontAwesomeIcon icon={faLink} color={'var(--buttonsFontColorOverride, #424242)'} />
}