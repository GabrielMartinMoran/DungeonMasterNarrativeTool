import '../styles/Navbar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionMenuButton } from './SessionMenuButton';
import { AuthRepository } from '../repositories/auth-repository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';

export type NavbarProps = {
    appContext: AppContext;
};

export const Navbar: React.FC<NavbarProps> = ({ appContext }) => {
    const [backButtonUrl, setBackButtonUrl] = useState('/');
    const [forwardButtonUrl, setForwardButtonUrl] = useState('/');
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const navigate = useNavigate();

    const setNarrativeContextById = (narrativeContextId: string) => {
        let obtainedNarrativeContext = null;
        if (narrativeContextId) {
            obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
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
                <div className="flex1">
                    <Link to={`/`} id="homeTitleLink">
                        <FontAwesomeIcon icon={faDiceD20} /> Inicio
                    </Link>
                </div>
                <div className="textCenter">
                    {narrativeContext ? (
                        <Link
                            to={`/narrative-context/${narrativeContext.narrativeContextId}`}
                            id="narrativeContextTitleLink"
                        >
                            {narrativeContext.name}
                        </Link>
                    ) : (
                        <></>
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
                    <span> </span>
                    <span className={`iconButton ${forwardButtonUrl ? 'iconButtonActive' : 'iconButtonInactive'}`}>
                        {forwardButtonUrl ? (
                            <Link to={forwardButtonUrl}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Link>
                        ) : (
                            <FontAwesomeIcon icon={faAngleRight} className="inactiveLink" />
                        )}
                    </span>
                    {appContext.getRepository(AuthRepository).isAuthenticated() ? (
                        <SessionMenuButton appContext={appContext} />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};
