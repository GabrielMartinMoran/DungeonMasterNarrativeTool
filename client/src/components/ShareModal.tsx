import '../styles/ShareModal.css';
import React, { useEffect, useState } from 'react';
import { ShareIcon } from './icons/ShareIcon';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
import { UserIcon } from './icons/UserIcon';
import { RemoveIcon } from './icons/RemoveIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';
import { useRepository } from '../hooks/use-repository';

export type ShareModalProps = {
    appContext: AppContext;
    narrativeContext: NarrativeContext;
    onClosed: () => void;
};

export const ShareModal: React.FC<ShareModalProps> = ({ appContext, narrativeContext, onClosed }) => {
    const [sharedUsernames, setSharedUsernames] = useState([]);
    const [usernameToShare, setUsernameToShare] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [shareBtnEnabled, setShareBtnEnabled] = useState(false);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);

    useEffect(() => {
        const init = async () => {
            const usernames = await narrativeContextRepository.getSharedUsernames(narrativeContext.narrativeContextId);
            setSharedUsernames(usernames);
        };
        init();
    }, []);

    const shareNarrativeContext = async () => {
        await narrativeContextRepository.share(usernameToShare, narrativeContext.narrativeContextId);
        setUsernameToShare('');
        setShareBtnEnabled(false);
        const usernames = await narrativeContextRepository.getSharedUsernames(narrativeContext.narrativeContextId);
        setSharedUsernames(usernames);
    };

    const unshareNarrativeContext = async (username: string) => {
        await narrativeContextRepository.unshare(username, narrativeContext.narrativeContextId);
        const usernames = await narrativeContextRepository.getSharedUsernames(narrativeContext.narrativeContextId);
        setSharedUsernames(usernames);
    };

    const onUsernameToShareChange = (event: any) => {
        const username = event.target.value;
        setUsernameToShare(username);
        setErrorMsg(null);
        if (!username) return setShareBtnEnabled(false);
        if (sharedUsernames.find((x) => x === username)) {
            setErrorMsg(`Ya compartes este elemento con ${username}`);
            setShareBtnEnabled(false);
            return;
        }
        setShareBtnEnabled(true);
    };

    return (
        <div className="ShareModal">
            <h3>Compartes {narrativeContext.name} con</h3>
            <div className="ShareModalShareWithContainer">
                <div className="ShareModalShareWithInput">
                    <input
                        value={usernameToShare}
                        onChange={onUsernameToShareChange}
                        placeholder="Nombre de usuario con quien compartir"
                    />
                </div>
                <div className="ShareModalShareWithBtn">
                    <button onClick={shareNarrativeContext} disabled={!shareBtnEnabled}>
                        <ShareIcon /> Compartir
                        <span className="tooltip">Compartir</span>
                    </button>
                </div>
            </div>
            {errorMsg ? <span className="formErrorMsg">{errorMsg}</span> : null}
            <div>
                {sharedUsernames.map((x) => (
                    <div key={x} className="ShareModalSharedWithContainer">
                        <span className="ShareModalSharedWithUsername">
                            <UserIcon />
                            <span>{x}</span>
                        </span>
                        <span className="ShareModalSharedWithBtnContainer">
                            <button onClick={() => unshareNarrativeContext(x)}>
                                <RemoveIcon />
                                <span className="btnText">Dejar de compartir</span>
                                <span className="tooltip">Dejar de compartir</span>
                            </button>
                        </span>
                    </div>
                ))}
            </div>
            <div className="CloseShareModalContainer">
                <button className="CloseShareModalBtn" onClick={onClosed}>
                    <FontAwesomeIcon icon={faXmark} /> Cancelar
                </button>
            </div>
        </div>
    );
};
