import { ParagraphElement } from '../models/paragraph-element';
import { ContainerElement } from '../models/container-element';
import { ShopElement } from '../models/shop-element';

export class ElementsFactory {
    static _ELEMENT_TYPES_MAPPING: any = {
        paragraph: ParagraphElement,
        container: ContainerElement,
        shop: ShopElement,
        npc: ParagraphElement,
        location: ParagraphElement,
        creature: ParagraphElement,
        item: ParagraphElement,
    };

    static mapElementFromJson(data: any) {
        const instance = this._ELEMENT_TYPES_MAPPING[data.type].fromJson(data);
        instance.id = data['id'];
        return instance;
    }

    static createElement(name: string, type: string) {
        if (this._ELEMENT_TYPES_MAPPING[type] === ParagraphElement) {
            return new this._ELEMENT_TYPES_MAPPING[type](name, type);
        } else {
            return new this._ELEMENT_TYPES_MAPPING[type](name);
        }
    }
}
