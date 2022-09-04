import '../styles/NarrativeCategoryComponent.css';
import React, { useState } from 'react';
import { CreateElementButton } from './CreateElementButton';
import { ElementsFactory } from '../utils/elements-factory';
import { ElementListItem } from './ElementListItem';
import { RenameIcon } from './icons/RenameIcon';
import { MoveUpIcon } from './icons/MoveUpIcon';
import { MoveDownIcon } from './icons/MoveDownIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
import { NarrativeCategory } from '../models/narrative-category';
import { BaseElement } from '../models/base-element';

export type NarrativeCategoryComponentProps = {
    appContext: AppContext;
    narrativeContext: NarrativeContext;
    narrativeCategory: NarrativeCategory;
    onCategoryChange: () => void;
    moveCategoryUp: (narrativeCategory: NarrativeCategory) => void;
    moveCategoryDown: (narrativeCategory: NarrativeCategory) => void;
};

export const NarrativeCategoryComponent: React.FC<NarrativeCategoryComponentProps> = ({
    appContext,
    narrativeContext,
    narrativeCategory,
    onCategoryChange,
    moveCategoryUp,
    moveCategoryDown,
}) => {
    const [elementsState, setElementsState] = useState(narrativeCategory.elements);

    const onChange = async () => {
        // As elements are cloned, we assign them to the narrative category before saving
        narrativeCategory.elements = elementsState;
        await appContext.saveNarrativeContext(narrativeContext);
        setElementsState([...narrativeCategory.elements]);
        //setTimeout(() => setElementsState(narrativeCategory.elements), 0);
    };

    const onCreateElement = (type: string) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        narrativeCategory.addElement(newElement);
        appContext.saveNarrativeContext(narrativeContext);
        onChange();
    };

    const deleteElement = (element: BaseElement) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        narrativeCategory.removeElement(element.id);
        appContext.saveNarrativeContext(narrativeContext);
        onChange();
    };

    const moveElementUp = (element: BaseElement) => {
        narrativeCategory.moveElementUp(element.id);
        appContext.saveNarrativeContext(narrativeContext);
        onChange();
    };

    const moveElementDown = (element: BaseElement) => {
        narrativeCategory.moveElementDown(element.id);
        appContext.saveNarrativeContext(narrativeContext);
        onChange();
    };

    const renameElement = (element: BaseElement) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        appContext.saveNarrativeContext(narrativeContext);
        onCategoryChange();
    };

    const deleteCategory = () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar la categoría ${narrativeCategory.name}`);
        if (!shouldDelete) return;
        narrativeContext.removeNarrativeCategory(narrativeCategory.id);
        appContext.saveNarrativeContext(narrativeContext);
        onCategoryChange();
    };

    const renameCategory = () => {
        const name = window.prompt('Ingresa el nuevo nombre de la categoría', narrativeCategory.name);
        if (!name) return;
        narrativeCategory.name = name;
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
                {elementsState.map((element: BaseElement) => (
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
                        onChildUpdate={onChange}
                    />
                ))}
            </div>
        </div>
    );
};
