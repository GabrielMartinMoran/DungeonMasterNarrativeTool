import '../styles/Navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionMenuButton } from './SessionMenuButton';
import { AuthRepository } from '../repositories/auth-repository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
import { MenuIcon } from './icons/MenuIcon';
import logo from '../assets/img/logo.png';

export type NavbarProps = {
    appContext: AppContext;
    toggleShowMenu: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ appContext, toggleShowMenu }) => {
    const [backButtonUrl, setBackButtonUrl] = useState('/');
    const [forwardButtonUrl, setForwardButtonUrl] = useState('/');
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const navigate = useNavigate();
    const menuButtonRef = useRef(null);

    useEffect(() => {
        appContext.menuButtonRef = menuButtonRef;
        return () => {
            appContext.menuButtonRef = null;
        };
    }, []);

    const setNarrativeContextById = async (narrativeContextId: string) => {
        let obtainedNarrativeContext = null;
        if (narrativeContextId) {
            obtainedNarrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId);
        }
        setNarrativeContext(obtainedNarrativeContext);
    };

    const navigateToPreviousElement = () => {
        if (!backButtonUrl) return;
        navigate(backButtonUrl);
    };

    const navigateToNextElement = () => {
        if (!forwardButtonUrl) return;
        navigate(forwardButtonUrl);
    };

    (appContext as any).setBackButtonUrl = setBackButtonUrl;
    (appContext as any).setForwardButtonUrl = setForwardButtonUrl;
    appContext._setNarrativeContextById = setNarrativeContextById;
    appContext.navigateToPreviousElement = navigateToPreviousElement;
    appContext.navigateToNextElement = navigateToNextElement;

    return (
        <div className="Navbar">
            <div className="navbarContent">
                <span ref={menuButtonRef} className="toggleMenuBtn" onClick={toggleShowMenu}>
                    <MenuIcon />
                </span>
                <div className="NavbarNarrativeContextName">
                    {narrativeContext ? (
                        <Link
                            to={`/narrative-context/${narrativeContext.narrativeContextId}`}
                            id="narrativeContextTitleLink"
                        >
                            {
                                {
                                    campaign: '📚',
                                    world: '🌎',
                                }[narrativeContext.type]
                            }{' '}
                            {narrativeContext.name}
                        </Link>
                    ) : (
                        <Link to={`/`} id="narrativeContextTitleLink">
                            🪶 Narrative tools
                        </Link>
                    )}
                </div>
                <div className="flex2 textRight" id="nabvarNavigationIcons">
                    <span className={`iconButton ${backButtonUrl ? 'iconButtonActive' : 'iconButtonInactive'}`}>
                        {backButtonUrl ? (
                            <Link to={backButtonUrl}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </Link>
                        ) : (
                            <FontAwesomeIcon icon={faAngleLeft} className="inactiveLink" />
                        )}
                    </span>
                    <span className={`iconButton ${forwardButtonUrl ? 'iconButtonActive' : 'iconButtonInactive'}`}>
                        {forwardButtonUrl ? (
                            <Link to={forwardButtonUrl}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                        ) : (
                            <FontAwesomeIcon icon={faAngleRight} className="inactiveLink" />
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};
