import { BaseElement } from './base-element';
import { ShopItem } from './shop-item';

export class ShopElement extends BaseElement {
    items = null;

    constructor(name, items = []) {
        super(name, BaseElement.TYPES.SHOP);
        this.items = items;
    }

    toJson() {
        const json = super.toJson();
        json['items'] = this.items.map((x) => x.toJson());
        return json;
    }

    static fromJson(data) {
        const instance = new ShopElement(
            data['name'],
            data['items'].map((x) => ShopItem.fromJson(x))
        );
        return instance;
    }
}
