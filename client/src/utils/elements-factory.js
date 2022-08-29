import { ParagraphElement } from '../models/paragraph-element';
import { ContainerElement } from '../models/container-element';
import { ShopElement } from '../models/shop-element';

export class ElementsFactory {
    static _ELEMENT_TYPES_MAPPING = {
        paragraph: ParagraphElement,
        container: ContainerElement,
        shop: ShopElement,
    };

    static mapElementFromJson(data) {
        const instance = this._ELEMENT_TYPES_MAPPING[data['type']].fromJson(data);
        instance.id = data['id'];
        return instance;
    }

    static createElement(name, type) {
        return new this._ELEMENT_TYPES_MAPPING[type](name);
    }
}
