import '../styles/Navbar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionMenuButton } from './SessionMenuButton';
import { AuthRepository } from '../repositories/auth-repository';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faDiceD20 } from '@fortawesome/free-solid-svg-icons';

export function Navbar({ appContext }) {
    const [backButtonUrl, setBackButtonUrl] = useState('/');
    const [forwardButtonUrl, setForwardButtonUrl] = useState('/');
    const [narrativeContext, setNarrativeContext] = useState(null);
    const navigate = useNavigate();

    const setNarrativeContextById = (narrativeContextId) => {
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

    appContext.setBackButtonUrl = setBackButtonUrl;
    appContext.setForwardButtonUrl = setForwardButtonUrl;
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
                        <Link to={`/narrative-context/${narrativeContext.narrativeContextId}`} id="narrativeContextTitleLink">
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
}
