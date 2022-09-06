import '../styles/UpdatingDBIndicator.css';
import React from 'react';
import { faCircleNotch, faCloudUploadAlt, faDiceD20, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type UpdatingDBIndicatorProps = {};

export const UpdatingDBIndicator: React.FC<UpdatingDBIndicatorProps> = ({}) => {
    return (
        <div className="UpdatingDBIndicator">
            <FontAwesomeIcon className="updatingDBIcon" icon={faCircleNotch} />
        </div>
    );
};
