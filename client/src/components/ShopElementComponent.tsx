import '../styles/ShopElementComponent.css';
import React, { useState } from 'react';
import { ShopTableEditor } from './ShopTableEditor';
import { AppContext } from '../app-context';
import { ShopElement } from '../models/shop-element';
import { ShopItem } from '../models/shop-item';

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
    let currentEditorItems: ShopItem[] | null = null;
    let hasChangedAtLeastOneTime = false;
    const childFunctions: any = {};

    const edit = () => {
        setEditMode(true);
    };

    const save = async () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.items = currentEditorItems!;
        const narrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);
        await appContext.repositories.narrativeContext.save(narrativeContext);
        setEditMode(false);
    };

    const discardChanges = () => {
        currentEditorItems = [];
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
                    <button onClick={addItem}>
                        <span role="img" aria-label="plus">
                            ➕
                        </span>{' '}
                        Agregar objeto
                    </button>
                    <button onClick={save}>
                        <span role="img" aria-label="save">
                            💾
                        </span>{' '}
                        Guardar cambios
                    </button>
                    <button onClick={discardChanges}>
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
