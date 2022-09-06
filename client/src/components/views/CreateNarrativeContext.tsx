import '../../styles/CreateNarrativeContext.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../app-context';
import { NarrativeContextFactory } from '../../factories/narrative-context-factory';
import { NarrativeContext } from '../../models/narrative-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook } from '@fortawesome/free-solid-svg-icons';

export type CreateNarrativeContextProps = {
    appContext: AppContext;
};

export const CreateNarrativeContext: React.FC<CreateNarrativeContextProps> = ({ appContext }) => {
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>(NarrativeContext.TYPES[0].type);

    useEffect(() => {
        const init = async () => {
            await appContext.setNarrativeContextById(null);
        };
        init();
    }, [appContext]);

    const create = async () => {
        const narrativeContext = NarrativeContextFactory.create(appContext, type, name);
        await appContext.repositories.narrativeContext.save(narrativeContext!);
        navigate('/');
    };

    return (
        <div className="CreateNarrativeContext" onSubmit={(e) => e.preventDefault()}>
            <form className="CreateNarrativeContextContainer">
                <h3>Crear contexto narrativo</h3>
                <input type="text" placeholder="Nombre" onChange={(event) => setName(event.target.value)} autoFocus/>
                <select onChange={(event) => setType(event.target.value)}>
                    {NarrativeContext.TYPES.map((x) => (
                        <option key={x.type} value={x.type}>
                            {x.name}
                        </option>
                    ))}
                </select>
                <button type="submit" onClick={create}>
                    <FontAwesomeIcon icon={faBook} /> Crear
                </button>
                <button onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Cancelar
                </button>
            </form>
        </div>
    );
};
