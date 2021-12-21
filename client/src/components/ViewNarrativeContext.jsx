import '../styles/ViewNarrativeContext.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NarrativeCategory } from '../models/narrative-category';
import { NarrativeCategoryComponent } from './NarrativeCategoryComponent';

export function ViewNarrativeContext({ appContext }) {
    const navigate = useNavigate();
    const { narrativeContextId } = useParams();
    const [narrativeContext, setNarrativeContext] = useState(null);
    const [narrativeContextCategories, setNarrativeContextCategories] = useState([]);

    useEffect(() => {
        appContext.setNarrativeContextById(narrativeContextId);
        const obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
        setNarrativeContext(obtainedNarrativeContext);
        setNarrativeContextCategories(obtainedNarrativeContext.categories);
        appContext.setBackButtonUrl('/');
        appContext.setForwardButtonUrl(null);
    }, [appContext, narrativeContextId]);

    const addNarrativeCategory = () => {
        const categoryName = window.prompt('Ingresa nombre de la categoría');
        if (categoryName) {
            const category = new NarrativeCategory(categoryName);
            const narrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            narrativeContext.addNarrativeCategory(category);
            appContext.saveDB();
            setNarrativeContextCategories([...narrativeContext.categories]);
        }
    }

    const deleteNarrativeContext = () => {
        const shouldDelete = window.confirm(`Estas seguro que deseas eliminar ${narrativeContext.type === 'world' ? 'el mundo' : 'la campaña'
            } ${narrativeContext.name}`);
        if (!shouldDelete) return;
        appContext.getDB().removeNarrativeContext(narrativeContextId);
        appContext.saveDB();
        navigate('/');
    }

    const renameMarrativeContext = () => {
        const name = window.prompt(`Ingresa el nuevo nombre de ${narrativeContext.type === 'world' ? 'el mundo' : 'la campaña'}`, narrativeContext.name);
        if (!name) return;
        narrativeContext.name = name;
        appContext.saveDB();
        setNarrativeContext({ ...narrativeContext });
        setTimeout(() => setNarrativeContext(narrativeContext), 0);
    }

    const onCategoryChange = () => {
        setNarrativeContextCategories([...narrativeContext.categories]);
    }

    const moveCategoryUp = (category) => {
        narrativeContext.moveNarrativeCategoryUp(category.id);
        appContext.saveDB();
        setNarrativeContextCategories([...narrativeContext.categories]);
    }

    const moveCategoryDown = (category) => {
        narrativeContext.moveNarrativeCategoryDown(category.id);
        appContext.saveDB();
        setNarrativeContextCategories([...narrativeContext.categories]);
    }

    return <div className="ViewNarrativeContext">
        <div className='flex narrativeContextTitleBar'>
            <h1 className='flex2'>{
                narrativeContext?.type === 'world' ?
                    <span role='img' aria-label='world'>🌎</span> :
                    <span role='img' aria-label='books'>📚</span>
            } {narrativeContext?.name}</h1>
            <div className='textRight narrativeContextTitleButtons'>
                <button onClick={addNarrativeCategory}>
                    <span role='img' aria-label='plus'>➕</span>
                    <span className='tooltip'>Crear categoría</span>
                </button>
                <button onClick={renameMarrativeContext}>
                    <span role='img' aria-label='tag'>🏷️</span>
                    <span className='tooltip'>Renombrar</span>
                </button>
                <button onClick={deleteNarrativeContext}>
                    <span role='img' aria-label='delete'>🗑️</span>
                    <span className='tooltip'>Eliminar</span>
                </button>
            </div>
        </div>
        {
            narrativeContextCategories.map(category =>
                <NarrativeCategoryComponent key={category.id} appContext={appContext}
                    narrativeCategory={category} narrativeContext={narrativeContext}
                    onCategoryChange={onCategoryChange} moveCategoryUp={moveCategoryUp}
                    moveCategoryDown={moveCategoryDown} />)
        }
    </div>;
}