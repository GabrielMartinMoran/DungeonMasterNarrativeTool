import '../styles/ElementListItem.css';
import React, { useRef, useState } from 'react';
import { BaseElement } from '../models/base-element';
import { Link } from 'react-router-dom';
import { ElementsFactory } from '../utils/elements-factory';
import { CreateElementButton } from './CreateElementButton';

export function ElementListItem({ appContext, narrativeContextId, narrativeCategoryId, element,
    onMoveElementUp = (element) => { }, onMoveElementDown = (element) => { },
    onDeleteElement = (element) => { }, onRenameElement = (element) => { },
    onChildUpdate = () => { } }) {

    const isContainer = () => {
        return element.type === BaseElement.TYPES.CONTAINER;
    }

    const shouldDisplayLink = () => {
        return !isContainer();
    }

    const getIcon = () => {
        const icons = {};
        icons[BaseElement.TYPES.PARAGRAPH] = '📜';
        icons[BaseElement.TYPES.CONTAINER] = '📂';
        icons[BaseElement.TYPES.SHOP] = '🪙';
        return icons[element.type];
    }

    const createChildElement = (type) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        element.addElement(newElement);
        appContext.saveDB();
        onChildUpdate();
    }

    const deleteChildElement = (childElement) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${childElement.name}`);
        if (!shouldDelete) return;
        element.removeElement(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    }

    const moveChildElementUp = (childElement) => {
        element.moveElementUp(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    }

    const moveChildElementDown = (childElement) => {
        element.moveElementDown(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    }

    const renameChildElement = (element) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        appContext.saveDB();
        onChildUpdate();
    }


    return <div className="ElementListItem">
        <div className='flex'>
            <div className='flex2'><span role='img' aria-label='icon'>{getIcon()}</span>
                {
                    shouldDisplayLink() ?
                        <Link to={`/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${element.id}`}>
                            {element.name}
                        </Link> :
                        <span>
                            {element.name}
                        </span>
                }
            </div>

            <div className='textRight'>
                {
                    isContainer() ?
                        <CreateElementButton onClick={createChildElement} /> : <></>
                }
                <button onClick={() => onRenameElement(element)}>
                    <span role='img' aria-label='tag'>🏷️</span>
                    <span className='tooltip'>Renombrar</span>
                </button>
                <button onClick={() => onMoveElementUp(element)}>
                    <span role='img' aria-label='up'>⬆️</span>
                    <span className='tooltip'>Subir</span>
                </button>
                <button onClick={() => onMoveElementDown(element)}>
                    <span role='img' aria-label='down'>⬇️</span>
                    <span className='tooltip'>Bajar</span>
                </button>
                <button onClick={() => onDeleteElement(element)}>
                    <span role='img' aria-label='delete'>🗑️</span>
                    <span className='tooltip'>Eliminar</span>
                </button>
            </div>
        </div>
        {
            isContainer() ?
                <div>{
                    element.elements.map(chileElement =>
                        <ElementListItem key={chileElement.id} appContext={appContext}
                            narrativeContextId={narrativeContextId}
                            narrativeCategoryId={narrativeCategoryId} element={chileElement}
                            onMoveElementUp={moveChildElementUp} onMoveElementDown={moveChildElementDown}
                            onDeleteElement={deleteChildElement} onRenameElement={renameChildElement}
                            onChildUpdate={onChildUpdate} />
                    )
                }
                </div> : <></>
        }
    </div>;
}