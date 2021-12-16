import '../styles/NarrativeCategoryComponent.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseElement } from '../models/base-element';
import { CreateElementButton } from './CreateElementButton';
import { ElementsFactory } from '../utils/elements-factory';
import { ElementListItem } from './ElementListItem';

export function NarrativeCategoryComponent({ appContext, narrativeContext, narrativeCategory, onCategoryChange, moveCategoryUp, moveCategoryDown }) {

    const [elementsState, setElementsState] = useState(narrativeCategory.elements);

    const rerender = () => {
        setElementsState([...narrativeCategory.elements]);
        setTimeout(() => setElementsState(narrativeCategory.elements), 0);
    }

    const onCreateElement = (type) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        narrativeCategory.addElement(newElement);
        appContext.saveDB();
        rerender();
    }

    const deleteElement = (element) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        narrativeCategory.removeElement(element.id);
        appContext.saveDB();
        rerender();
    }

    const moveElementUp = (element) => {
        narrativeCategory.moveElementUp(element.id);
        appContext.saveDB();
        rerender();
    }

    const moveElementDown = (element) => {
        narrativeCategory.moveElementDown(element.id);
        appContext.saveDB();
        rerender();
    }

    const renameElement = (element) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        appContext.saveDB();
        onCategoryChange();
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
                <CreateElementButton onClick={onCreateElement} />
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
        <div className="narrativeCategoryElements">
            {
                elementsState.map(element =>
                    <ElementListItem key={element.id} appContext={appContext}
                        narrativeContextId={narrativeContext.id}
                        narrativeCategoryId={narrativeCategory.id} element={element}
                        onMoveElementUp={moveElementUp} onMoveElementDown={moveElementDown}
                        onDeleteElement={deleteElement} onRenameElement={renameElement}
                        onChildUpdate={rerender} />
                )
            }
        </div>
    </div>;
}