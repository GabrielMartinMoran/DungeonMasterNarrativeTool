import '../styles/ShareModal.css';
import React, { useEffect, useState } from 'react';
import { ShareIcon } from './icons/ShareIcon';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';

export type ShareModalProps = {
    appContext: AppContext;
    narrativeContext: NarrativeContext;
    onClosed: () => void;
};

export const ShareModal: React.FC<ShareModalProps> = ({ appContext, narrativeContext, onClosed }) => {
    const [sharedUsernames, setSharedUsernames] = useState([]);
    const [usernameToShare, setUsernameToShare] = useState('');

    useEffect(() => {
        const init = async () => {
            const usernames = await appContext.getNarrativeContextSharedUsernames(narrativeContext.narrativeContextId);
            setSharedUsernames(usernames);
        };
        init();
    }, []);

    const shareNarrativeContext = async () => {
        await appContext.shareNarrativeContext(usernameToShare, narrativeContext.narrativeContextId);
        const usernames = await appContext.getNarrativeContextSharedUsernames(narrativeContext.narrativeContextId);
        setSharedUsernames(usernames);
    };

    const unshareNarrativeContext = async (username: string) => {
        await appContext.unshareNarrativeContext(username, narrativeContext.narrativeContextId);
        const usernames = await appContext.getNarrativeContextSharedUsernames(narrativeContext.narrativeContextId);
        setSharedUsernames(usernames);
    };

    return (
        <div className="ShareModal">
            <h3>Usuarios con los que compartes {narrativeContext.name}</h3>
            <ul>
                {sharedUsernames.map((x) => (
                    <li key={x}>
                        {x}
                        <button onClick={() => unshareNarrativeContext(x)}>
                            X<span className="tooltip">Dejar de compartir</span>
                        </button>
                    </li>
                ))}
            </ul>
            <input
                value={usernameToShare}
                onChange={(event) => setUsernameToShare(event.target.value)}
                placeholder="Nombre de usuario"
            ></input>
            <button onClick={shareNarrativeContext}>
                <ShareIcon />
                <span className="tooltip">Compartir</span>
            </button>
            <button onClick={onClosed}>
                X<span className="tooltip">Cerrar</span>
            </button>
        </div>
    );
};
