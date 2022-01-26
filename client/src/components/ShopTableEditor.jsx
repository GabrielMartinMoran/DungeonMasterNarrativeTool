import React, { useState } from 'react';
import '../styles/ParagraphElementComponent.css';
import { ShopItem } from '../models/shop-item';

export function ShopTableEditor({ appContext, items, onItemsChange = (items) => { }, parentExposedFuntions }) {

    const [itemsList, setItemsList] = useState(items?.map(x => x.clone()) || []);


    const addItem = () => {
        itemsList.push(new ShopItem());
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    }

    const removeItem = (item) => {
        itemsList.splice(itemsList.indexOf(item), 1);
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    }

    const updateItemProp = (item, prop, value) => {
        item[prop] = value;
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    }

    parentExposedFuntions.addItem = addItem;


    return <div className="ShopTableEditor">
        <table className="shopTable">
            <tbody>
                <tr>
                    <th>Objeto</th>
                    <th>Enlace</th>
                    <th>Precio</th>
                    <th>Cantidad disponible</th>
                    <th></th>
                </tr>
                {
                    itemsList?.map(x => <tr key={x.id}>
                        <td>
                            <input key={`${x.id}-titleInput`} onChange={(event) => updateItemProp(x, 'title', event.target.value)}
                                value={x.title || ''} />
                        </td>
                        <td>
                            <input key={`${x.id}-linkInput`} onChange={(event) => updateItemProp(x, 'link', event.target.value)}
                                value={x.link || ''} />
                        </td>
                        <td>
                            <input key={`${x.id}-priceInput`} onChange={(event) => updateItemProp(x, 'price', event.target.value)}
                                value={x.price || ''} />
                        </td>
                        <td>
                            <input type='number' key={`${x.id}-amountInput`} onChange={(event) => updateItemProp(x, 'amount', parseInt(event.target.value))}
                                value={x.amount || 0} />
                        </td>
                        <td>
                            <button onClick={() => removeItem(x)}>
                                <span role='img' aria-label='delete'>🗑️</span>
                            </button>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>
    </div>;
}