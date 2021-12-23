import '../styles/Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faDiceD20 } from '@fortawesome/free-solid-svg-icons';

export function Navbar({ appContext }) {

    const [backButtonUrl, setBackButtonUrl] = useState('/');
    const [forwardButtonUrl, setForwardButtonUrl] = useState('/');
    const [narrativeContext, setNarrativeContext] = useState(null);

    const setNarrativeContextById = (narrativeContextId) => {
        let obtainedNarrativeContext = null;
        if (narrativeContextId) {
            obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
        }
        setNarrativeContext(obtainedNarrativeContext);
    }

    appContext.setBackButtonUrl = setBackButtonUrl;
    appContext.setForwardButtonUrl = setForwardButtonUrl;
    appContext.setNarrativeContextById = setNarrativeContextById;

    return <div className='Navbar'>
        <div className='navbarContent'>
            <div className='flex1'>
                <Link to={`/`} id='homeTitleLink'>
                    <FontAwesomeIcon icon={faDiceD20} /> Inicio
                </Link>
            </div>
            <div className='textCenter'>
                {
                    narrativeContext ?
                        <Link to={`/narrative-context/${narrativeContext.id}`} id='narrativeContextTitleLink'>{narrativeContext.name}</Link> :
                        <></>
                }
            </div>
            <div className='flex2 textRight' id='nabvarNavigationIcons'>
                <span className={`iconButton ${backButtonUrl ? 'iconButtonActive' : 'iconButtonInactive'
                    }`}>
                    {

                        backButtonUrl ? <Link to={backButtonUrl}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Link> :
                            <FontAwesomeIcon icon={faAngleLeft} className='inactiveLink' />
                    }
                </span>
                <span> </span>
                <span className={`iconButton ${forwardButtonUrl ? 'iconButtonActive' : 'iconButtonInactive'
                    }`}>
                    {
                        forwardButtonUrl ? <Link to={forwardButtonUrl}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Link> :
                            <FontAwesomeIcon icon={faAngleRight} className='inactiveLink' />
                    }
                </span>
            </div>
        </div>
    </div>;
}