import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../app-context';

export type LocationChangeDetectorProps = {
    appContext: AppContext;
};

export const LocationChangeDetector: React.FC<LocationChangeDetectorProps> = ({ appContext }) => {
    const location = useLocation();

    useEffect(() => {
        // In case the user changes the location when editing
        appContext.canOpenSearchBar = true;
    }, [location]);

    return null;
};
