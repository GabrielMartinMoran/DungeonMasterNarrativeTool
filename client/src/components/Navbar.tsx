import '../styles/Navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
import { MenuIcon } from './icons/MenuIcon';
import { useRepository } from '../hooks/use-repository';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';
import { useNarrativeContext } from '../hooks/use-narrative-context';
import { useNavigationButtonsURLStore } from '../hooks/stores/use-navigation-buttons-url-store';

export type NavbarProps = {
    appContext: AppContext;
    toggleShowMenu: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ appContext, toggleShowMenu }) => {
    const { backButtonURL, forwardButtonURL } = useNavigationButtonsURLStore();
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const menuButtonRef = useRef(null);
    const { configureSetNarrativeContextCallback } = useNarrativeContext();
    const narrativeContextRepository = useRepository(NarrativeContextRepository);

    useEffect(() => {
        appContext.menuButtonRef = menuButtonRef;
        return () => {
            appContext.menuButtonRef = null;
        };
    }, [narrativeContext]);

    const setNarrativeContextById = async (narrativeContextId: string | null) => {
        let obtainedNarrativeContext = null;
        if (narrativeContextId) {
            obtainedNarrativeContext = await narrativeContextRepository.get(narrativeContextId);
        }
        setNarrativeContext(obtainedNarrativeContext);
    };

    configureSetNarrativeContextCallback(setNarrativeContextById);

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
                    <span className={`iconButton ${backButtonURL ? 'iconButtonActive' : 'iconButtonInactive'}`}>
                        {backButtonURL ? (
                            <Link to={backButtonURL}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </Link>
                        ) : (
                            <FontAwesomeIcon icon={faAngleLeft} className="inactiveLink" />
                        )}
                    </span>
                    <span className={`iconButton ${forwardButtonURL ? 'iconButtonActive' : 'iconButtonInactive'}`}>
                        {forwardButtonURL ? (
                            <Link to={forwardButtonURL}>
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
