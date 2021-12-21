import { BaseElement } from './base-element';
import { ElementsFactory } from '../utils/elements-factory';
import { ArrayUtils } from '../utils/array-utils';

export class ContainerElement extends BaseElement {
    elements = null;

    constructor(name, elements = []) {
        super(name, BaseElement.TYPES.CONTAINER);
        this.elements = elements;
    }

    getElement(elementId) {
        return this.elements.find(x => x.id === elementId);
    }

    addElement(element) {
        this.elements.push(element);
    }

    removeElement(elementId) {
        const element = this.getElement(elementId);
        this.elements.splice(this.elements.indexOf(element), 1);
    }

    moveElementUp(elementId) {
        const oldIndex = this.elements.indexOf(this.elements.find(x => x.id === elementId));
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        ArrayUtils.moveElementInArray(this.elements, oldIndex, newIndex);
    }

    moveElementDown(elementId) {
        const oldIndex = this.elements.indexOf(this.elements.find(x => x.id === elementId));
        const newIndex = oldIndex + 1;
        if (newIndex === this.elements.length) return;
        ArrayUtils.moveElementInArray(this.elements, oldIndex, newIndex);
    }

    findInChild(elementId) {
        for (const element of this.elements) {
            if (element.id === elementId) return element;
            if (element.findInChild) {
                const found = element.findInChild(elementId);
                if (found) return found;
            }
        }
        return null;
    }

    // Returns a plain list of viewable elements obtained through iteraring al childs
    getPlainViewableElements() {
        let plainElements = [];
        for (const element of this.elements) {
            if (element.type === BaseElement.TYPES.CONTAINER) {
                plainElements = plainElements.concat(element.getPlainViewableElements());
            } else {
                plainElements.push(element);
            }
        }
        return plainElements;
    }

    toJson() {
        const json = super.toJson();
        json['elements'] = this.elements.map(x => x.toJson());
        return json;
    }

    static fromJson(data) {
        const instance = new ContainerElement(
            data['name'],
            (data['elements'] || []).map(x => ElementsFactory.mapElementFromJson(x))
        );
        return instance;
    }
}