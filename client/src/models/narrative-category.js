import { IdGenerator } from '../utils/id-generator';
import { ArrayUtils } from '../utils/array-utils';
import { ElementsFactory } from '../utils/elements-factory';
import { BaseElement } from './base-element';

export class NarrativeCategory {
    id = null;
    type = null;
    elements = null;

    constructor(name) {
        this.id = IdGenerator.generateId();
        this.name = name;
        this.elements = [];
    }

    getElement(elementId) {
        return this.elements.find(x => x.id === elementId);
    }

    findElementAnywhere(elementId) {
        for (const element of this.elements) {
            if (element.id === elementId) return element;
            if (element.findInChild) {
                const found = element.findInChild(elementId);
                if (found) return found;
            }
        }
        return null;
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
    
    // Returns a plain list of viewable elements obtained through iteraring al childs
    _getPlainViewableElements() {
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

    getPrevElement(elementId) {
        const viewableElements = this._getPlainViewableElements();
        const index = viewableElements.indexOf(viewableElements.find(x => x.id === elementId));
        if (index === 0) return null;
        return viewableElements[index - 1];
    }

    getNextElement(elementId) {
        const viewableElements = this._getPlainViewableElements();
        const index = viewableElements.indexOf(viewableElements.find(x => x.id === elementId));
        if (index === (viewableElements.length - 1)) return null;
        return viewableElements[index + 1];
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            elements: this.elements.map(element => element.toJson())
        }
    }

    static fromJson(data) {
        const instance = new NarrativeCategory(
            data['name']
        );
        instance.id = data['id'];
        instance.elements = data['elements'].map(x => ElementsFactory.mapElementFromJson(x));
        return instance;
    }
}