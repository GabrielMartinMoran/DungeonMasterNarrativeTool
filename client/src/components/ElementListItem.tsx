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
import { AppContext } from '../app-context';
import { ContainerElement } from '../models/container-element';
import { Container } from 'react-dom';

export type ElementListItemProps = {
    appContext: AppContext;
    narrativeContextId: string;
    narrativeCategoryId: string;
    element: BaseElement;
    isEditable: boolean;
    onMoveElementUp: (element: BaseElement) => void;
    onMoveElementDown: (element: BaseElement) => void;
    onDeleteElement: (element: BaseElement) => void;
    onRenameElement: (element: BaseElement) => void;
    onChildUpdate: () => void;
    tabElement?: boolean;
};

export const ElementListItem: React.FC<ElementListItemProps> = ({
    appContext,
    narrativeContextId,
    narrativeCategoryId,
    element,
    isEditable,
    onMoveElementUp,
    onMoveElementDown,
    onDeleteElement,
    onRenameElement,
    onChildUpdate,
    tabElement = false,
}) => {
    const [highlight, setHighlight] = useState(false);
    const [expanded, setExpanded] = useState((appContext.elementListItemExpandedStatuses as any)[element.id] || false);

    const isContainer = () => {
        return element.type === BaseElement.TYPES.CONTAINER;
    };

    const shouldDisplayLink = () => {
        return !isContainer();
    };

    const getIcon = () => {
        const icons: any = {};
        icons[BaseElement.TYPES.PARAGRAPH] = <ScrollIcon />;
        icons[BaseElement.TYPES.CONTAINER] = <FolderIcon />;
        icons[BaseElement.TYPES.SHOP] = <ShopIcon />;
        return icons[element.type];
    };

    const createChildElement = (type: string) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        (element as ContainerElement).addElement(newElement);
        onChildUpdate();
    };

    const deleteChildElement = (childElement: BaseElement) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${childElement.name}`);
        if (!shouldDelete) return;
        (element as ContainerElement).removeElement(childElement.id);
        onChildUpdate();
    };

    const moveChildElementUp = (childElement: BaseElement) => {
        (element as ContainerElement).moveElementUp(childElement.id);
        onChildUpdate();
    };

    const moveChildElementDown = (childElement: BaseElement) => {
        (element as ContainerElement).moveElementDown(childElement.id);
        onChildUpdate();
    };

    const renameChildElement = (element: BaseElement) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
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
            <div className={'flex ' + (highlight ? 'highlightedListItem' : 'unhighlightedListItem')}>
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
                    {isEditable ? (
                        <>
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
                        </>
                    ) : null}
                </div>
            </div>
            {isContainer() ? (
                <div>
                    {expanded ? (
                        (element as ContainerElement).elements.map((childElement: BaseElement) => (
                            <ElementListItem
                                key={childElement.id}
                                appContext={appContext}
                                narrativeContextId={narrativeContextId}
                                narrativeCategoryId={narrativeCategoryId}
                                element={childElement}
                                isEditable={isEditable}
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
};
