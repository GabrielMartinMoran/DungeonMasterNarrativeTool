import '../styles/NarrativeCategoryComponent.css';
import React, { useState } from 'react';
import { CreateElementButton } from './CreateElementButton';
import { ElementsFactory } from '../utils/elements-factory';
import { ElementListItem } from './ElementListItem';
import { RenameIcon } from './icons/RenameIcon';
import { MoveUpIcon } from './icons/MoveUpIcon';
import { MoveDownIcon } from './icons/MoveDownIcon';
import { DeleteIcon } from './icons/DeleteIcon';

export function NarrativeCategoryComponent({
    appContext,
    narrativeContext,
    narrativeCategory,
    onCategoryChange,
    moveCategoryUp,
    moveCategoryDown,
}) {
    const [elementsState, setElementsState] = useState(narrativeCategory.elements);

    const rerender = async () => {
        await appContext.saveNarrativeContext(narrativeContext);
        setElementsState([...narrativeCategory.elements]);
        setTimeout(() => setElementsState(narrativeCategory.elements), 0);
    };

    const onCreateElement = (type) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        narrativeCategory.addElement(newElement);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        rerender();
    };

    const deleteElement = (element) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        narrativeCategory.removeElement(element.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        rerender();
    };

    const moveElementUp = (element) => {
        narrativeCategory.moveElementUp(element.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        rerender();
    };

    const moveElementDown = (element) => {
        narrativeCategory.moveElementDown(element.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        rerender();
    };

    const renameElement = (element) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        onCategoryChange();
    };

    const deleteCategory = () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar la categoría ${narrativeCategory.name}`);
        if (!shouldDelete) return;
        narrativeContext.removeNarrativeCategory(narrativeCategory.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        onCategoryChange();
    };

    const renameCategory = () => {
        const name = window.prompt('Ingresa el nuevo nombre de la categoría', narrativeCategory.name);
        if (!name) return;
        narrativeCategory.name = name;
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        onCategoryChange();
    };

    return (
        <div className="NarrativeCategory">
            <div className="flex">
                <h3 className="flex2">{narrativeCategory.name}</h3>
                <div className="textRight narrativeCategoryTitleButtons">
                    <CreateElementButton onClick={onCreateElement} />
                    <button onClick={renameCategory}>
                        <RenameIcon />
                        <span className="tooltip">Renombrar</span>
                    </button>
                    <button onClick={() => moveCategoryUp(narrativeCategory)}>
                        <MoveUpIcon />
                        <span className="tooltip">Subir</span>
                    </button>
                    <button onClick={() => moveCategoryDown(narrativeCategory)}>
                        <MoveDownIcon />
                        <span className="tooltip">Bajar</span>
                    </button>
                    <button onClick={deleteCategory}>
                        <DeleteIcon />
                        <span className="tooltip">Eliminar categoría</span>
                    </button>
                </div>
            </div>
            <div className="narrativeCategoryElements">
                {elementsState.map((element) => (
                    <ElementListItem
                        key={element.id}
                        appContext={appContext}
                        narrativeContextId={narrativeContext.narrativeContextId}
                        narrativeCategoryId={narrativeCategory.id}
                        element={element}
                        onMoveElementUp={moveElementUp}
                        onMoveElementDown={moveElementDown}
                        onDeleteElement={deleteElement}
                        onRenameElement={renameElement}
                        onChildUpdate={rerender}
                    />
                ))}
            </div>
        </div>
    );
}
