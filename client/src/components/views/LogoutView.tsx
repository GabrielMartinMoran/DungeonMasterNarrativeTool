import React, { useEffect } from 'react';
import { AppContext } from '../../app-context';
import { useRepository } from '../../hooks/use-repository';
import { AuthRepository } from '../../repositories/auth-repository';
import { useNavigationButtonsURLStore } from '../../hooks/stores/use-navigation-buttons-url-store';

export type LogoutViewProps = {
    appContext: AppContext;
};

export const LogoutView: React.FC<LogoutViewProps> = ({ appContext }) => {
    const authRepository = useRepository(AuthRepository);
    const { setBackButtonURL, setForwardButtonURL } = useNavigationButtonsURLStore();

    useEffect(() => {
        setBackButtonURL(null);
        setForwardButtonURL(null);
        authRepository.logout();
    }, [appContext]);

    return <></>;
};
