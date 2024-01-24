import '../styles/SessionMenuButton.css';
import React, { Ref, useRef } from 'react';
import { AuthRepository } from '../repositories/auth-repository';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChangePasswordIcon } from './icons/ChangePasswordIcon';
import { AppContext } from '../app-context';
import { useRepository } from '../hooks/use-repository';

export type SessionMenuButtonProps = {
    appContext: AppContext;
};

export const SessionMenuButton: React.FC<SessionMenuButtonProps> = ({ appContext }) => {
    const authRepository = useRepository(AuthRepository);
    const dropdownBody: any | null = useRef();

    const showDropdown = () => {
        dropdownBody.current.classList.toggle('showDropdownBody');
    };

    const logout = () => {
        authRepository.logout();
    };

    const changePassword = () => {
        const password = window.prompt('Ingresa la nueva contraseña');
    };

    return (
        <div className="SessionMenuButton">
            <button className="sessionIconButton" onClick={showDropdown}>
                <UserIcon />
            </button>
            <div ref={dropdownBody} className="dropdownBody">
                <button onClick={changePassword}>
                    <ChangePasswordIcon /> Cambiar contraseña
                </button>
                <button onClick={logout}>
                    <LogoutIcon /> Cerrar sesión
                </button>
            </div>
        </div>
    );
};
