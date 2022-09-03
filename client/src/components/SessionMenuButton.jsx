import '../styles/SessionMenuButton.css';
import React, { useRef } from 'react';
import { AuthRepository } from '../repositories/auth-repository';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChangePasswordIcon } from './icons/ChangePasswordIcon';

export function SessionMenuButton({ appContext }) {
    const dropdownBody = useRef();

    const showDropdown = () => {
        dropdownBody.current.classList.toggle('showDropdownBody');
    };

    const logout = () => {
        appContext.getRepository(AuthRepository).logout();
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
}
