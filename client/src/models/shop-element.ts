import { BaseElement } from './base-element';
import { ShopItem } from './shop-item';

export class ShopElement extends BaseElement {
    items: ShopItem[];

    constructor(name: string, items = []) {
        super(name, BaseElement.TYPES.SHOP);
        this.items = items;
    }

    toJson(): any {
        const json: any = super.toJson();
        json.items = this.items.map((x) => x.toJson());
        return json;
    }

    static fromJson(data: any): ShopElement {
        const instance = new ShopElement(
            data.name,
            data.items.map((x: any) => ShopItem.fromJson(x))
        );
        return instance;
    }
}
