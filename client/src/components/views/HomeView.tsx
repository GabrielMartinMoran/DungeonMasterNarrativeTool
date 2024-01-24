import '../../styles/Home.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EXTERNAL_TOOLS } from '../../data/external-tools';
import { CreateNarrativeContextIcon } from '../icons/CreateNarrativeContextIcon';
import { ImportNarrativeContextIcon } from '../icons/ImportNarrativeContextIcon';
import { NarrativeContextImporter } from '../../utils/narrative-context-importer';
import { AppContext } from '../../app-context';
import { NarrativeContext } from '../../models/narrative-context';
import { useRepository } from '../../hooks/use-repository';
import { NarrativeContextRepository } from '../../repositories/narrative-context-repository';
import { useNarrativeContext } from '../../hooks/use-narrative-context';
import { useNavigationButtonsURLStore } from '../../hooks/stores/use-navigation-buttons-url-store';

export type HomeViewProps = {
    appContext: AppContext;
};

export const HomeView: React.FC<HomeViewProps> = ({ appContext }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [narrativeContexts, setNarrativeContexts] = useState<NarrativeContext[]>([]);
    const [sharedNarrativeContexts, setSharedNarrativeContexts] = useState<NarrativeContext[]>([]);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);
    const { setNarrativeContextById } = useNarrativeContext();
    const { setBackButtonURL, setForwardButtonURL } = useNavigationButtonsURLStore();

    useEffect(() => {
        const init = async () => {
            setNarrativeContextById(null);
            setBackButtonURL(null);
            setForwardButtonURL(null);

            setNarrativeContexts(await narrativeContextRepository.list());

            setSharedNarrativeContexts(await narrativeContextRepository.listShared());

            setIsLoading(false);
        };
        init();
    }, []);

    const createElementDB = () => {
        navigate('/create-narrative-context');
    };

    const importNarrativeContext = async (e: any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            const json = e.target!.result;
            await NarrativeContextImporter.importFromJson(json, appContext);
            setNarrativeContexts(await narrativeContextRepository.list());
            (document.getElementById('narrativeContextFileSelector')! as any).value = null;
        };
        reader.readAsText(e.target.files[0]);
    };

    const getCampaigns = () => {
        return narrativeContexts.filter((x: NarrativeContext) => x.isCampaign());
    };

    const getWorlds = () => {
        return narrativeContexts.filter((x: NarrativeContext) => x.isWorld());
    };

    const getSharedCampaigns = () => {
        return sharedNarrativeContexts.filter((x: NarrativeContext) => x.isCampaign());
    };

    const getSharedWorlds = () => {
        return sharedNarrativeContexts.filter((x: NarrativeContext) => x.isWorld());
    };

    return (
        <div>
            <div className="homeTitleSection">
                <h1 className="flex1">🪶 Narrative tools</h1>
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
            <h2>👤 Tu contenido</h2>
            <h3>
                <span role="img" aria-label="books">
                    📚
                </span>{' '}
                Campañas
            </h3>
            {getCampaigns().length > 0 ? (
                <ul>
                    {getCampaigns().map((x: NarrativeContext) => (
                        <li key={x.narrativeContextId}>
                            <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="HomeNoContentText">
                    {isLoading ? 'Cargando tus campañas' : 'Todavía no has creado ninguna campaña'}
                </div>
            )}
            <h3>
                <span role="img" aria-label="world">
                    🌎
                </span>{' '}
                Mundos
            </h3>
            {getWorlds().length > 0 ? (
                <ul>
                    {getWorlds().map((x: NarrativeContext) => (
                        <li key={x.narrativeContextId}>
                            <Link to={`/narrative-context/${x.narrativeContextId}`}>{x.name}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="HomeNoContentText">
                    {isLoading ? 'Cargando tus mundos' : 'Todavía no has creado ningun mundo'}
                </div>
            )}
            <h2>👥 Contenido compartido contigo</h2>
            <h3>
                <span role="img" aria-label="books">
                    📚
                </span>{' '}
                Campañas
            </h3>
            {getSharedCampaigns().length > 0 ? (
                <ul>
                    {getSharedCampaigns().map((x: NarrativeContext) => (
                        <li key={x.narrativeContextId}>
                            <Link to={`/narrative-context/${x.narrativeContextId}`}>
                                {x.name} (de {x.username})
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="HomeNoContentText">
                    {isLoading ? 'Cargando las campañas que te compatieron' : 'Nadie esta compartiendote una campaña'}
                </div>
            )}
            <h3>
                <span role="img" aria-label="world">
                    🌎
                </span>{' '}
                Mundos
            </h3>
            {getSharedWorlds().length > 0 ? (
                <ul>
                    {getSharedWorlds().map((x: NarrativeContext) => (
                        <li key={x.narrativeContextId}>
                            <Link to={`/narrative-context/${x.narrativeContextId}`}>
                                {x.name} (de {x.username})
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="HomeNoContentText">
                    {isLoading ? 'Cargando los mundos que te compatieron' : 'Nadie esta compartiendote un mundo'}
                </div>
            )}

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
