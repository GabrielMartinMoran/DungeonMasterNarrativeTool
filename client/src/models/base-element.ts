import { IdGenerator } from '../utils/id-generator';

export class BaseElement {
    id: string;
    name: string;
    type: string;

    static TYPES = {
        PARAGRAPH: 'paragraph',
        CONTAINER: 'container',
        SHOP: 'shop',
    };

    constructor(name: string, type: string) {
        this.id = IdGenerator.generateId();
        this.name = name;
        this.type = type;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
        };
    }

    static fromJson(data: any) {
        throw Error('This method should not be used!');
    }
}
