import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ParagraphElement.css';
import '../styles/NarrativeCategoryComponent.css';
import { Element } from '../models/element';

export function NarrativeCategoryComponent({ appContext, narrativeCategory, narrativeContext, onCategoryChange, moveCategoryUp, moveCategoryDown }) {

    const [elementsState, setElementsState] = useState(narrativeCategory.elements);

    const addElement = () => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = new Element(name);
        narrativeCategory.addElement(newElement);
        appContext.saveDB();
        setElementsState([...narrativeCategory.elements]);
    }

    const deleteElement = (element) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        narrativeCategory.removeElement(element.id);
        appContext.saveDB();
        setElementsState([...narrativeCategory.elements]);
    }

    const moveElementUp = (element) => {
        narrativeCategory.moveElementUp(element.id);
        appContext.saveDB();
        setElementsState([...narrativeCategory.elements]);
    }

    const moveElementDown = (element) => {
        narrativeCategory.moveElementDown(element.id);
        appContext.saveDB();
        setElementsState([...narrativeCategory.elements]);
    }

    const deleteCategory = () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar la categoría ${narrativeCategory.name}`);
        if (!shouldDelete) return;
        narrativeContext.removeNarrativeCategory(narrativeCategory.id);
        appContext.saveDB();
        onCategoryChange();
    }

    const renameCategory = () => {
        const name = window.prompt('Ingresa el nuevo nombre de la categoría', narrativeCategory.name);
        if (!name) return;
        narrativeCategory.name = name;
        appContext.saveDB();
        onCategoryChange();
    }

    return <div className="NarrativeCategory">
        <div className='flex'>
            <h3 className='flex2'>{narrativeCategory.name}</h3>
            <div className='textRight narrativeCategoryTitleButtons'>
                <button onClick={addElement}>
                    <span role='img' aria-label='plus'>➕</span>
                    Crear elemento
                </button>
                <button onClick={renameCategory}>
                    <span role='img' aria-label='tag'>🏷️</span>
                    Renombrar
                </button>
                <button onClick={() => moveCategoryUp(narrativeCategory)}>
                    <span role='img' aria-label='up'>⬆️ Subir</span>
                </button>
                <button onClick={() => moveCategoryDown(narrativeCategory)}>
                    <span role='img' aria-label='down'>⬇️ Bajar</span>
                </button>
                <button onClick={deleteCategory}>
                    <span role='img' aria-label='delete'>🗑️</span>
                    Eliminar categoría
                </button>
            </div>
        </div>

        <ul>
            {elementsState.map(element =>
                <li key={`${narrativeContext.id}/${element.id}`}>
                    <div className='flex'>
                        <Link to={`/narrative-context/${narrativeContext.id}/${narrativeCategory.id}/${element.id}`}
                            className='flex2'>{element.name}</Link>
                        <div className='textRight'>
                            <button onClick={() => moveElementUp(element)}>
                                <span role='img' aria-label='up'>⬆️ Subir</span>
                            </button>
                            <button onClick={() => moveElementDown(element)}>
                                <span role='img' aria-label='down'>⬇️ Bajar</span>
                            </button>
                            <button onClick={() => deleteElement(element)}>
                                <span role='img' aria-label='delete'>🗑️ Eliminar</span>
                            </button>
                        </div>
                    </div>
                </li>)
            }
        </ul>
    </div>;
}