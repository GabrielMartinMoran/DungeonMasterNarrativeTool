import { BaseElement } from './base-element';

export class ParagraphElement extends BaseElement {
    body = null;

    constructor(name, body = null) {
        super(name, BaseElement.TYPES.PARAGRAPH);
        this.body = body;
    }

    toJson() {
        const json = super.toJson();
        json['body'] = this.body;
        return json;
    }

    static fromJson(data) {
        const instance = new ParagraphElement(
            data['name'],
            data['body']
        );
        return instance;
    }
}