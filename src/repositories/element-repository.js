import { DBRepository } from './db-repository';

export class ElementRepository extends DBRepository {

    getElement(elementId, contextId) {
        return this.getDB().getNarrativeContext(contextId)?.getElement(elementId);
    }

    addElement(element, contextId) {
        this.getDB().getNarrativeContext(contextId).addElement(element);
        this.save();
    }

    removeElement(elementId, contextId) {
        this.getDB().getNarrativeContext(contextId).removeElement(elementId);
        this.save();
    }

    moveElementUp(elementId, contextId) {
        const elements = this.getDB().getNarrativeContext(contextId).elements;
        const oldIndex = elements.indexOf(elements.find(x => x.id === elementId));
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        this._move_element_in_array(elements, oldIndex, newIndex);
        this.save();
    }

    moveElementDown(elementId, contextId) {
        const elements = this.getDB().getNarrativeContext(contextId).elements;
        const oldIndex = elements.indexOf(elements.find(x => x.id === elementId));
        const newIndex = oldIndex + 1;
        if (newIndex === elements.length) return;
        this._move_element_in_array(elements, oldIndex, newIndex);
        this.save();
    }

    _move_element_in_array(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    getPrevElement(elementId, contextId) {
        const elements = this.getDB().getNarrativeContext(contextId).elements;
        const index = elements.indexOf(elements.find(x => x.id === elementId));
        if (index === 0) return null;
        return elements[index - 1];
    }

    getNextElement(elementId, contextId) {
        const elements = this.getDB().getNarrativeContext(contextId).elements;
        const index = elements.indexOf(elements.find(x => x.id === elementId));
        if (index === (elements.length - 1)) return null;
        return elements[index + 1];
    }

}