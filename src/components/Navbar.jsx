import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

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
                <Link to={`/`}>
                    <span role='img' aria-label='dice'>🎲</span> Inicio
                </Link>
            </div>
            <div className='textCenter'>
                {
                    narrativeContext ?
                        <Link to={`/narrative-context/${narrativeContext.id}`}>{narrativeContext.name}</Link> :
                        <></>
                }
            </div>
            <div className='flex2 textRight'>
                {
                    backButtonUrl ? <Link to={backButtonUrl}>
                        <span className='roundIconButton' role='img' aria-label='backArrow'>⬅</span>
                    </Link> :
                        <span className='roundIconButton' role='img' aria-label='backArrow' className='inactiveLink'>
                            ⬅
                        </span>
                }
                <span> </span>
                {
                    forwardButtonUrl ? <Link to={forwardButtonUrl}>
                        <span className='roundIconButton' role='img' aria-label='forwardArrow'>➡</span>
                    </Link> :
                        <span className='roundIconButton' role='img' aria-label='forwardArrow' className='inactiveLink'>
                            ➡
                        </span>
                }
            </div>
        </div>
    </div>;
}