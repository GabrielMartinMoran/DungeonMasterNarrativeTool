import '../styles/ParagraphElementComponent.css';
import { ShopItem } from '../models/shop-item';
import { AppContext } from '../app-context';
import React, { useState } from 'react';

export type ShopTableEditorProps = {
    appContext: AppContext;
    items: ShopItem[];
    onItemsChange: (items: ShopItem[]) => void;
    parentExposedFunctions: any;
};

export const ShopTableEditor: React.FC<ShopTableEditorProps> = ({
    appContext,
    items,
    onItemsChange,
    parentExposedFunctions: parentExposedFunctions,
}) => {
    const [itemsList, setItemsList] = useState<ShopItem[]>(items?.map(x => x.clone()) ?? []);

    const addItem = () => {
        itemsList.push(new ShopItem('', '', ''));
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    };

    const removeItem = (item: ShopItem) => {
        itemsList.splice(itemsList.indexOf(item), 1);
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    };

    const updateItemProp = (item: ShopItem, prop: string, value: any) => {
        (item as any)[prop] = value;
        onItemsChange([...itemsList]);
        setItemsList([...itemsList]);
    };

    parentExposedFunctions.addItem = addItem;

    return (
        <div className="ShopTableEditor">
            <table className="shopTable">
                <tbody>
                    <tr>
                        <th>Objeto</th>
                        <th>Enlace</th>
                        <th>Precio</th>
                        <th>Cantidad disponible</th>
                        <th></th>
                    </tr>
                    {itemsList
                        ? itemsList.map(x => (
                              <tr key={x.id}>
                                  <td>
                                      <input
                                          key={`${x.id}-titleInput`}
                                          onChange={event => updateItemProp(x, 'title', event.target.value)}
                                          value={x.title || ''}
                                      />
                                  </td>
                                  <td>
                                      <input
                                          key={`${x.id}-linkInput`}
                                          onChange={event => updateItemProp(x, 'link', event.target.value)}
                                          value={x.link || ''}
                                      />
                                  </td>
                                  <td>
                                      <input
                                          key={`${x.id}-priceInput`}
                                          onChange={event => updateItemProp(x, 'price', event.target.value)}
                                          value={x.price || ''}
                                      />
                                  </td>
                                  <td>
                                      <input
                                          type="number"
                                          key={`${x.id}-amountInput`}
                                          onChange={event => updateItemProp(x, 'amount', parseInt(event.target.value))}
                                          value={x.amount || 0}
                                      />
                                  </td>
                                  <td>
                                      <button onClick={() => removeItem(x)}>
                                          <span role="img" aria-label="delete">
                                              🗑️
                                          </span>
                                      </button>
                                  </td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
        </div>
    );
};
