import { BaseElement } from './base-element';

export class ParagraphElement extends BaseElement {
    body: string | null;

    constructor(name: string, body: string | null = null) {
        super(name, BaseElement.TYPES.PARAGRAPH);
        this.body = body;
    }

    toJson() {
        const json: any = super.toJson();
        json.body = this.body;
        return json;
    }

    static fromJson(data: any): ParagraphElement {
        const instance = new ParagraphElement(data.name, data.body);
        return instance;
    }
}
