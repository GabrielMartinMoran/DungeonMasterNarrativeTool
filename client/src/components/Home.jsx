import '../styles/Home.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EXTERNAL_TOOLS } from '../data/external-tools';

export function Home({ appContext }) {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [worlds, setWorlds] = useState([]);

    useEffect(() => {
        appContext.setNarrativeContextById(null);
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        const db = appContext.getDB();
        setCampaigns(db.campaigns);
        setWorlds(db.worlds);
    }, [appContext]);

    const createElementDB = () => {
        navigate('/create-narrative-context');
    }

    return <div>
        <div className='flex'>
            <h1 className='flex1'>Home</h1>
            <div className='textRight homeTitleButtons'>
                <button onClick={createElementDB}>
                    <span role='img' aria-label='book'>📖</span> Crear contexto narrativo
                </button>
            </div>
        </div>


        <h2><span role='img' aria-label='books'>📚</span> Campañas</h2>
        <ul>
            {campaigns.map(x => <li key={x.id}>
                <Link to={`/narrative-context/${x.id}`}>{x.name}</Link>
            </li>)}
        </ul>
        <h2><span role='img' aria-label='world'>🌎</span> Mundos</h2>
        <ul>
            {worlds.map(x => <li key={x.id}>
                <Link to={`/narrative-context/${x.id}`}>{x.name}</Link>
            </li>)}
        </ul>
        <h2><span role='img' aria-label='tools'>⚒️</span> Herramientas</h2>
        <ul>
            {EXTERNAL_TOOLS.map(x => <li key={x.name}>
                <a href={x.url}>{x.name}</a>
            </li>)}
        </ul>
    </div>;
}