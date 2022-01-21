import '../styles/ShopElementComponent.css';
import React, { useState } from 'react';
import { DBRepository } from '../repositories/db-repository';
import { ShopTableEditor } from './ShopTableEditor';


export function ShopElementComponent({ appContext, element, parentExposedFuntions }) {

    const [editMode, setEditMode] = useState(false);
    let currentEditorItems = null;
    let hasChangedAtLeastOneTime = false;
    const childFunctions = {}

    const edit = () => {
        setEditMode(true);
    }

    const save = () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.items = currentEditorItems;
        appContext.saveDBAsync();
        setEditMode(false);
    }

    const discardChanges = () => {
        currentEditorItems = [];
        setEditMode(false);
    }

    const onItemsChange = (items) => {
        hasChangedAtLeastOneTime = true;
        currentEditorItems = items;
    }

    const addItem = () => {
        childFunctions.addItem();
    }

    parentExposedFuntions.edit = edit;

    return <div className="ParagraphElement">
        {
            editMode ? <>
                <button onClick={addItem}>
                    <span role='img' aria-label='plus'>➕</span> Agregar objeto
                </button>
                <button onClick={save}>
                    <span role='img' aria-label='save'>💾</span> Guardar cambios
                </button>
                <button onClick={discardChanges}>
                    <span role='img' aria-label='cancel'>❌</span> Descartar cambios
                </button>
            </> : <></>
        }
        <br></br>
        {
            editMode ?
                <>
                    <ShopTableEditor items={element.items} onItemsChange={onItemsChange}
                        parentExposedFuntions={childFunctions} />
                </> :
                <table className="shopTable">
                    <thead>
                        <tr>
                            <th>Objeto</th>
                            <th>Precio</th>
                            <th>Cantidad disponible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            element.items.map(x => <tr key={x.id}
                                className={
                                    element.items.indexOf(x) % 2 ?
                                        'oddRow' : 'evenRow'
                                }>
                                <td>{
                                    x.link ?
                                        <a href={x.link}>{x.title}</a> :
                                        <span>{x.title}</span>
                                }</td>
                                <td>{x.price}</td>
                                <td>{x.amount}</td>
                            </tr>)
                        }
                    </tbody>
                </table>

        }
    </div>;
}