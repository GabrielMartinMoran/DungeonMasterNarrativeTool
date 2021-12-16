import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NarrativeContext } from '../../models/narrative-context';

export function CreateNarrativeContext({ appContext }) {
    const navigate = useNavigate();

    const [name, setName] = useState();
    const [type, setType] = useState(NarrativeContext.TYPES[0].type);


    const create = () => {
        const narrativeContext = new NarrativeContext(type, name);
        appContext.getDB().addNarrativeContext(narrativeContext);
        appContext.saveDB();
        navigate('/');
    }

    return <div>
        <h1>Crear contexto</h1>
        <input type='text' placeholder='Nombre' onChange={(event) => setName(event.target.value)} />
        <select onChange={(event) => setType(event.target.value)}>
            {NarrativeContext.TYPES.map(x => <option key={x.type} value={x.type}>{x.name}</option>)}
        </select>
        <button onClick={create}>
            Crear
        </button>
    </div>;
}