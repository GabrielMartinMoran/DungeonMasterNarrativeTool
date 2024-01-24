import '../styles/ShopElementComponent.css';
import React, { useState } from 'react';
import { ShopTableEditor } from './ShopTableEditor';
import { AppContext } from '../app-context';
import { ShopElement } from '../models/shop-element';
import { ShopItem } from '../models/shop-item';
import { DirtyDBError } from '../errors/dirty-db-error';
import { useRepository } from '../hooks/use-repository';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';

export type ShopElementComponentProps = {
    appContext: AppContext;
    narrativeContextId: string;
    element: ShopElement;
    parentExposedFunctions: any;
};

export const ShopElementComponent: React.FC<ShopElementComponentProps> = ({
    appContext,
    narrativeContextId,
    element,
    parentExposedFunctions,
}) => {
    const [editMode, setEditMode] = useState(false);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);

    let currentEditorItems: ShopItem[] | null = null;
    let hasChangedAtLeastOneTime = false;
    const childFunctions: any = {};

    const edit = () => {
        appContext.canOpenSearchBar = false;
        setEditMode(true);
    };

    const save = async () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.items = currentEditorItems!;

        // Disable buttons while saving
        const addItemBtn = document.querySelector('#addItemBtn');
        if (addItemBtn) (addItemBtn as any).disabled = true;
        const saveBtn = document.querySelector('#saveBtn');
        if (saveBtn) (saveBtn as any).disabled = true;
        const cancelBtn = document.querySelector('#cancelBtn');
        if (cancelBtn) (cancelBtn as any).disabled = true;

        const narrativeContext = await narrativeContextRepository.get(narrativeContextId!);

        // Catch Dirty DB Errors in case of dirty reads
        try {
            await narrativeContextRepository.save(narrativeContext);
        } catch (err) {
            if (err instanceof DirtyDBError) {
                if (cancelBtn) (cancelBtn as any).disabled = false;
                return;
            }
            throw err;
        }

        appContext.canOpenSearchBar = true;
        setEditMode(false);
    };

    const discardChanges = () => {
        currentEditorItems = [];
        appContext.canOpenSearchBar = true;
        setEditMode(false);
    };

    const onItemsChange = (items: ShopItem[]) => {
        hasChangedAtLeastOneTime = true;
        currentEditorItems = items;
    };

    const addItem = () => {
        childFunctions.addItem();
    };

    parentExposedFunctions.edit = edit;

    return (
        <div className="ParagraphElement">
            {editMode ? (
                <>
                    <button id="addItemBtn" onClick={addItem}>
                        <span role="img" aria-label="plus">
                            ➕
                        </span>{' '}
                        Agregar objeto
                    </button>
                    <button id="saveBtn" onClick={save}>
                        <span role="img" aria-label="save">
                            💾
                        </span>{' '}
                        Guardar cambios
                    </button>
                    <button id="cancelBtn" onClick={discardChanges}>
                        <span role="img" aria-label="cancel">
                            ❌
                        </span>{' '}
                        Descartar cambios
                    </button>
                </>
            ) : (
                <></>
            )}
            <br></br>
            {editMode ? (
                <>
                    <ShopTableEditor
                        appContext={appContext}
                        items={element.items}
                        onItemsChange={onItemsChange}
                        parentExposedFunctions={childFunctions}
                    />
                </>
            ) : (
                <table className="shopTable">
                    <tbody>
                        <tr>
                            <th>Objeto</th>
                            <th>Precio</th>
                            <th>Cantidad disponible</th>
                        </tr>
                        {element.items.map((x) => (
                            <tr key={x.id}>
                                <td>{x.link ? <a href={x.link}>{x.title}</a> : <span>{x.title}</span>}</td>
                                <td>{x.price}</td>
                                <td>{x.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
