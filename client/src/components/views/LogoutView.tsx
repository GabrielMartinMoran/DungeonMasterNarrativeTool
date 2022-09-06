import React, { useEffect } from 'react';
import { AppContext } from '../../app-context';

export type LogoutViewProps = {
    appContext: AppContext;
};

export const LogoutView: React.FC<LogoutViewProps> = ({ appContext }) => {
    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        appContext.repositories.auth.logout();
    }, [appContext]);

    return <></>;
};
