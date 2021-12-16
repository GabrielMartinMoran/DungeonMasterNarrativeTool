import React, { useEffect, useState } from 'react';
import { DBRepository } from '../../repositories/db-repository';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Home.css';

export function Home({ appContext }) {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [worlds, setWorlds] = useState([]);

    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        const repo = appContext.getRepository(DBRepository);
        const db = repo.getDB();
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
    </div>;
}