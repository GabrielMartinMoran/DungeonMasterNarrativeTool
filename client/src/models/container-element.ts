import { BaseElement } from './base-element';
import { ElementsFactory } from '../utils/elements-factory';
import { ArrayUtils } from '../utils/array-utils';

export class ContainerElement extends BaseElement {
    elements: BaseElement[];

    constructor(name: string, elements = []) {
        super(name, BaseElement.TYPES.CONTAINER);
        this.elements = elements;
    }

    getElement(elementId: string): BaseElement | undefined {
        return this.elements.find((x) => x.id === elementId);
    }

    addElement(element: BaseElement) {
        this.elements.push(element);
    }

    removeElement(elementId: string) {
        const element = this.getElement(elementId)!;
        this.elements.splice(this.elements.indexOf(element), 1);
    }

    moveElementUp(elementId: string) {
        const oldIndex = this.elements.indexOf(this.elements.find((x) => x.id === elementId)!);
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        ArrayUtils.moveElementInArray(this.elements, oldIndex, newIndex);
    }

    moveElementDown(elementId: string) {
        const oldIndex = this.elements.indexOf(this.elements.find((x) => x.id === elementId)!);
        const newIndex = oldIndex + 1;
        if (newIndex === this.elements.length) return;
        ArrayUtils.moveElementInArray(this.elements, oldIndex, newIndex);
    }

    findInChild(elementId: string) {
        for (const element of this.elements) {
            if (element.id === elementId) return element;
            if ((element as any).findInChild) {
                const found = (element as any).findInChild(elementId);
                if (found) return found;
            }
        }
        return null;
    }

    // Returns a plain list of viewable elements obtained through iteraring al childs
    getPlainViewableElements(): BaseElement[] {
        let plainElements: BaseElement[] = [];
        for (const element of this.elements) {
            if (element.type === BaseElement.TYPES.CONTAINER) {
                plainElements = plainElements.concat((element as ContainerElement).getPlainViewableElements());
            } else {
                plainElements.push(element);
            }
        }
        return plainElements;
    }

    toJson() {
        const json: any = super.toJson();
        json.elements = this.elements.map((x) => x.toJson());
        return json;
    }

    static fromJson(data: any) {
        const instance = new ContainerElement(
            data.name,
            (data.elements || []).map((x: BaseElement) => ElementsFactory.mapElementFromJson(x))
        );
        return instance;
    }
}
