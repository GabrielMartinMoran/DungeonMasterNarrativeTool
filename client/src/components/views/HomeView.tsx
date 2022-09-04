import '../../styles/Home.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EXTERNAL_TOOLS } from '../../data/external-tools';
import { CreateNarrativeContextIcon } from '../icons/CreateNarrativeContextIcon';
import { ImportNarrativeContextIcon } from '../icons/ImportNarrativeContextIcon';
import { NarrativeContextImporter } from '../../utils/narrative-context-importer';
import { AppContext } from '../../app-context';
import { NarrativeContext } from '../../models/narrative-context';

export type HomeViewProps = {
    appContext: AppContext;
};

export const HomeView: React.FC<HomeViewProps> = ({ appContext }) => {
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState<NarrativeContext[]>([]);
    const [worlds, setWorlds] = useState<NarrativeContext[]>([]);

    const [sharedCampaigns, setSharedCampaigns] = useState<NarrativeContext[]>([]);
    const [sharedWorlds, setSharedWorlds] = useState<NarrativeContext[]>([]);

    useEffect(() => {
        appContext.setNarrativeContextById(null);
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
        const db = appContext.getDB();
        setCampaigns(db.getCampaigns());
        setWorlds(db.getWorlds());
        setSharedCampaigns(db.getSharedCampaigns());
        setSharedWorlds(db.getSharedWorlds());
    }, [appContext]);

    const createElementDB = () => {
        navigate('/create-narrative-context');
    };

    const importNarrativeContext = async (e: any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const json = e.target!.result;
            NarrativeContextImporter.importFromJson(json, appContext);
            const db = appContext.getDB();
            setCampaigns([...db.getCampaigns()]);
            setWorlds([...db.getWorlds()]);
            setTimeout(() => {
                setCampaigns(db.getCampaigns());
                setWorlds(db.getWorlds());
            }, 0);
            (document.getElementById('narrativeContextFileSelector')! as any).value = null;
        };
        reader.readAsText(e.target.files[0]);
    };

    return (
        <div>
            <div className="homeTitleSection">
                <h1 className="flex1">Contextos narrativos</h1>
                <div className="homeTitleButtons">
                    <button onClick={createElementDB}>
                        <CreateNarrativeContextIcon /> Crear
                    </button>
                    <input
                        type="file"
                        id="narrativeContextFileSelector"
                        hidden={true}
                        onChange={importNarrativeContext}
                        accept="application/json"
                    />
                    <button onClick={() => document.getElementById('narrativeContextFileSelector')!.click()}>
                        <ImportNarrativeContextIcon /> Importar
                    </button>
                </div>
            </div>

            <h2>
                <span role="img" aria-label="books">
                    📚
                </span>{' '}
                Tus campañas
            </h2>
            <ul>
                {campaigns.map((x: NarrativeContext) => (
                    <li key={x.narrativeContextId}>
                        <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                    </li>
                ))}
            </ul>
            <h2>
                <span role="img" aria-label="world">
                    🌎
                </span>{' '}
                Tus mundos
            </h2>
            <ul>
                {worlds.map((x: NarrativeContext) => (
                    <li key={x.narrativeContextId}>
                        <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                    </li>
                ))}
            </ul>

            <h2>
                <span role="img" aria-label="books">
                    📚
                </span>{' '}
                Campañas que te han compartido
            </h2>
            <ul>
                {sharedCampaigns.map((x: NarrativeContext) => (
                    <li key={x.narrativeContextId}>
                        <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                    </li>
                ))}
            </ul>
            <h2>
                <span role="img" aria-label="world">
                    🌎
                </span>{' '}
                Mundos que te han compartido
            </h2>
            <ul>
                {sharedWorlds.map((x: NarrativeContext) => (
                    <li key={x.narrativeContextId}>
                        <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                    </li>
                ))}
            </ul>

            <h2>
                <span role="img" aria-label="tools">
                    ⚒️
                </span>{' '}
                Herramientas
            </h2>
            <ul>
                {EXTERNAL_TOOLS.map((x) => (
                    <li key={x.name}>
                        <a href={x.url}>{x.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
