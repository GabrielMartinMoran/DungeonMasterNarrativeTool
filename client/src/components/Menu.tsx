import '../styles/Menu.css';
import React, { useEffect, useRef, useState } from 'react';
import { AppContext } from '../app-context';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHammer, faHouse, faKey, faPalette, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export type MenuProps = {
    appContext: AppContext;
    hideMenu: () => void;
    changeTheme: () => void;
};

export const Menu: React.FC<MenuProps> = ({ appContext, hideMenu, changeTheme }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            // If the user clicked outside of the menu but not in the icon for closing it
            if (!refClicked(event, menuRef) && !refClicked(event, appContext.menuButtonRef)) {
                hideMenu();
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const refClicked = (event: any, ref: any | null): boolean => {
        return ref && ref.current && (ref.current as any).contains(event.target);
    };

    return (
        <div ref={menuRef} className="Menu">
            <div className="MenuContainer">
                <h3>🪶 Narrative tools</h3>
                <span className="marginBottom1Rem" />
                <Link className="marginBottom0_5Rem" to={`/`} onClick={hideMenu}>
                    <FontAwesomeIcon className="marginRight0_5Rem" icon={faHouse} />
                    Inicio
                </Link>
                {appContext.authenticatedUser.isAdmin() ? (
                    <Link className="marginBottom0_5Rem" to={`/admin`} onClick={hideMenu}>
                        <FontAwesomeIcon className="marginRight0_5Rem" icon={faHammer} />
                        Administrar
                    </Link>
                ) : null}
                <span
                    className="marginBottom0_5Rem"
                    onClick={() => {
                        changeTheme();
                        hideMenu();
                    }}
                >
                    <FontAwesomeIcon className="marginRight0_5Rem" icon={faPalette} />
                    Cambiar tema
                </span>
                <span className="marginTop1Rem" />
                <h3 className="marginBottom1Rem">
                    {appContext.authenticatedUser.isAdmin() ? '🧙🏼‍♂️' : '👤'} {appContext.authenticatedUser.name}
                </h3>
                <span className="marginBottom1Rem" />
                <Link className="marginBottom0_5Rem" to={`/password`} onClick={hideMenu}>
                    <FontAwesomeIcon className="marginRight0_5Rem" icon={faKey} />
                    Cambiar contraseña
                </Link>
                <Link className="marginBottom0_5Rem" to={`/logout`} onClick={hideMenu}>
                    <FontAwesomeIcon className="marginRight0_5Rem" icon={faSignOutAlt} />
                    Cerrar sesión
                </Link>
            </div>{' '}
        </div>
    );
};
