import { IdGenerator } from '../utils/id-generator';
import { ArrayUtils } from '../utils/array-utils';
import { ElementsFactory } from '../utils/elements-factory';
import { BaseElement } from './base-element';
import { ContainerElement } from './container-element';

export class NarrativeCategory {
    id: string;
    name: string;
    elements: BaseElement[];

    constructor(name: string) {
        this.id = IdGenerator.generateId();
        this.name = name;
        this.elements = [];
    }

    getElement(elementId: string): BaseElement {
        return this.elements.find((x) => x.id === elementId)!;
    }

    findElementAnywhere(elementId: string): BaseElement | null {
        for (const element of this.elements) {
            if (element.id === elementId) return element;
            if ((element as any).findInChild) {
                const found = (element as any).findInChild(elementId);
                if (found) return found;
            }
        }
        return null;
    }

    addElement(element: BaseElement) {
        this.elements.push(element);
    }

    removeElement(elementId: string) {
        const element = this.getElement(elementId);
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

    getPrevElement(elementId: string) {
        const viewableElements = this.getPlainViewableElements();
        const index = viewableElements.indexOf(viewableElements.find((x) => x.id === elementId)!);
        if (index === 0) return null;
        return viewableElements[index - 1];
    }

    getNextElement(elementId: string) {
        const viewableElements = this.getPlainViewableElements();
        const index = viewableElements.indexOf(viewableElements.find((x) => x.id === elementId)!);
        if (index === viewableElements.length - 1) return null;
        return viewableElements[index + 1];
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            elements: this.elements.map((element) => element.toJson()),
        };
    }

    static fromJson(data: any) {
        const instance = new NarrativeCategory(data['name']);
        instance.id = data.id;
        instance.elements = data.elements.map((x: BaseElement) => ElementsFactory.mapElementFromJson(x));
        return instance;
    }
}
