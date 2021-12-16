import { IdGenerator } from '../utils/id-generator';

export class BaseElement {

    id = null;
    name = null;
    type = null;

    static TYPES = {
        PARAGRAPH: 'paragraph',
        CONTAINER: 'container'
    };    

    constructor(name, type) {
        this.id = IdGenerator.generateId();
        this.name = name;
        this.type = type;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            type: this.type
        }
    }

    static fromJson(data) {
        throw Error('This method should not be used!');
    }
}