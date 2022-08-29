import '../styles/ElementListItem.css';
import React, { useState } from 'react';
import { BaseElement } from '../models/base-element';
import { Link } from 'react-router-dom';
import { ElementsFactory } from '../utils/elements-factory';
import { CreateElementButton } from './CreateElementButton';
import { RenameIcon } from './icons/RenameIcon';
import { MoveUpIcon } from './icons/MoveUpIcon';
import { MoveDownIcon } from './icons/MoveDownIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { ScrollIcon } from './icons/ScrollIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ShopIcon } from './icons/ShopIcon';
import { CollapseIcon } from './icons/CollapseIcon';
import { ExpandIcon } from './icons/ExpandIcon';

export function ElementListItem({
    appContext,
    narrativeContextId,
    narrativeCategoryId,
    element,
    onMoveElementUp = (element) => {},
    onMoveElementDown = (element) => {},
    onDeleteElement = (element) => {},
    onRenameElement = (element) => {},
    onChildUpdate = () => {},
    tabElement = false,
}) {
    const [highlight, setHighlight] = useState(false);
    const [expanded, setExpanded] = useState(appContext.elementListItemExpandedStatuses[element.id] || false);

    const isContainer = () => {
        return element.type === BaseElement.TYPES.CONTAINER;
    };

    const shouldDisplayLink = () => {
        return !isContainer();
    };

    const getIcon = () => {
        const icons = {};
        icons[BaseElement.TYPES.PARAGRAPH] = <ScrollIcon />;
        icons[BaseElement.TYPES.CONTAINER] = <FolderIcon />;
        icons[BaseElement.TYPES.SHOP] = <ShopIcon />;
        return icons[element.type];
    };

    const createChildElement = (type) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        element.addElement(newElement);
        appContext.saveDB();
        onChildUpdate();
    };

    const deleteChildElement = (childElement) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${childElement.name}`);
        if (!shouldDelete) return;
        element.removeElement(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    };

    const moveChildElementUp = (childElement) => {
        element.moveElementUp(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    };

    const moveChildElementDown = (childElement) => {
        element.moveElementDown(childElement.id);
        appContext.saveDB();
        onChildUpdate();
    };

    const renameChildElement = (element) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        appContext.saveDB();
        onChildUpdate();
    };

    const highlightElement = () => {
        setHighlight(true);
    };

    const unhighlightElement = () => {
        setHighlight(false);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
        // To store the expanded status while navigating through the app
        appContext.elementListItemExpandedStatuses[element.id] = !expanded;
    };

    return (
        <div
            className={tabElement ? 'listItemTabbed' : ''}
            onMouseEnter={highlightElement}
            onMouseLeave={unhighlightElement}
        >
            <div className={'flex ' + (highlight ? 'highlightedListItem' : '')}>
                {isContainer() ? (
                    <button className="collapseExpandButton" onClick={() => toggleExpand()}>
                        {expanded ? <CollapseIcon /> : <ExpandIcon />}
                    </button>
                ) : (
                    <></>
                )}
                <div className={'flex2 elementListItemName '}>
                    <span role="img" aria-label="icon">
                        {getIcon()}{' '}
                    </span>
                    {shouldDisplayLink() ? (
                        <Link to={`/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${element.id}`}>
                            {element.name}
                        </Link>
                    ) : (
                        <span>{element.name}</span>
                    )}
                </div>

                <div className="textRight">
                    {isContainer() ? <CreateElementButton onClick={createChildElement} /> : <></>}
                    <button onClick={() => onRenameElement(element)}>
                        <RenameIcon />
                        <span className="tooltip">Renombrar</span>
                    </button>
                    <button onClick={() => onMoveElementUp(element)}>
                        <MoveUpIcon />
                        <span className="tooltip">Subir</span>
                    </button>
                    <button onClick={() => onMoveElementDown(element)}>
                        <MoveDownIcon />
                        <span className="tooltip">Bajar</span>
                    </button>
                    <button onClick={() => onDeleteElement(element)}>
                        <DeleteIcon />
                        <span className="tooltip">Eliminar</span>
                    </button>
                </div>
            </div>
            {isContainer() ? (
                <div>
                    {expanded ? (
                        element.elements.map((childElement) => (
                            <ElementListItem
                                key={childElement.id}
                                appContext={appContext}
                                narrativeContextId={narrativeContextId}
                                narrativeCategoryId={narrativeCategoryId}
                                element={childElement}
                                onMoveElementUp={moveChildElementUp}
                                onMoveElementDown={moveChildElementDown}
                                onDeleteElement={deleteChildElement}
                                onRenameElement={renameChildElement}
                                onChildUpdate={onChildUpdate}
                                tabElement={true}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
