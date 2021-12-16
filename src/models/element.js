import { IdGenerator } from '../utils/id-generator';

export class Element {

    id = null;
    name = null;
    body = null;

    constructor(name, body = null) {
        this.id = IdGenerator.generateId();
        this.name = name;
        this.body = body;
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            body: this.body
        }
    }

    static fromJson(data) {
        const instance = new Element(
            data['name'],
            data['body']
        );
        instance.id = data['id'];
        return instance;
    }
}