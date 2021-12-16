import { IdGenerator } from '../utils/id-generator';
import { Element } from './element';
import { ArrayUtils } from '../utils/array-utils';

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

    getPrevElement(elementId) {
        const index = this.elements.indexOf(this.elements.find(x => x.id === elementId));
        if (index === 0) return null;
        return this.elements[index - 1];
    }

    getNextElement(elementId) {
        const index = this.elements.indexOf(this.elements.find(x => x.id === elementId));
        if (index === (this.elements.length - 1)) return null;
        return this.elements[index + 1];
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
        instance.elements = data['elements'].map(x => Element.fromJson(x));
        return instance;
    }
}