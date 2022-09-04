import React, { useEffect } from 'react';
import { AppContext } from '../../app-context';
import { AuthRepository } from '../../repositories/auth-repository';

export type LogoutViewProps = {
    appContext: AppContext;
};

export const LogoutView: React.FC<LogoutViewProps> = ({ appContext }) => {
    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        appContext.getRepository(AuthRepository).logout();
    }, [appContext]);

    return <></>;
};
