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
        await appContext.repositories.narrativeContext.save(narrativeContext);
        setElementsState([...narrativeCategory.elements]);
        //setTimeout(() => setElementsState(narrativeCategory.elements), 0);
    };

    const onCreateElement = async (type: string) => {
        const name = window.prompt('Ingresa el nombre del nuevo elemento');
        if (!name) return;
        const newElement = ElementsFactory.createElement(name, type);
        // As elements are cloned, we assign them to the narrative category before saving
        narrativeCategory.elements = elementsState;
        narrativeCategory.addElement(newElement);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onChange();
    };

    const deleteElement = async (element: BaseElement) => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        // As elements are cloned, we assign them to the narrative category before saving
        narrativeCategory.elements = elementsState;
        narrativeCategory.removeElement(element.id);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onChange();
    };

    const moveElementUp = async (element: BaseElement) => {
        // As elements are cloned, we assign them to the narrative category before saving
        narrativeCategory.elements = elementsState;
        narrativeCategory.moveElementUp(element.id);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onChange();
    };

    const moveElementDown = async (element: BaseElement) => {
        // As elements are cloned, we assign them to the narrative category before saving
        narrativeCategory.elements = elementsState;
        narrativeCategory.moveElementDown(element.id);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onChange();
    };

    const renameElement = async (element: BaseElement) => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (!name) return;
        element.name = name;
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onCategoryChange();
    };

    const deleteCategory = async () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar la categoría ${narrativeCategory.name}`);
        if (!shouldDelete) return;
        narrativeContext.removeNarrativeCategory(narrativeCategory.id);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onCategoryChange();
    };

    const renameCategory = async () => {
        const name = window.prompt('Ingresa el nuevo nombre de la categoría', narrativeCategory.name);
        if (!name) return;
        narrativeCategory.name = name;
        await appContext.repositories.narrativeContext.save(narrativeContext);
        onCategoryChange();
    };

    return (
        <div className="NarrativeCategory">
            <div className="flex">
                <h3 className="flex2">{narrativeCategory.name}</h3>
                <div className="textRight narrativeCategoryTitleButtons">
                    {narrativeContext?.isEditable ? (
                        <>
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
                        </>
                    ) : null}
                </div>
            </div>
            <div className="narrativeCategoryElements">
                {elementsState.map((element: BaseElement) => (
                    <ElementListItem
                        key={element.id}
                        appContext={appContext}
                        isEditable={narrativeContext.isEditable}
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
