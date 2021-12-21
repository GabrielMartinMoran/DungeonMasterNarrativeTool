import React, { useEffect } from 'react';
import { AuthRepository } from '../repositories/auth-repository';

export function LogoutView({ appContext }) {

    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        appContext.getRepository(AuthRepository).logout();
    }, [appContext]);

    return <></>;

}