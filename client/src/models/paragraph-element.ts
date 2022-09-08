import { BaseElement } from './base-element';

export class ParagraphElement extends BaseElement {
    body: string | null;

    constructor(name: string, type: string, body: string | null = null) {
        super(name, type);
        this.body = body;
    }

    toJson() {
        const json: any = super.toJson();
        json.body = this.body;
        return json;
    }

    static fromJson(data: any): ParagraphElement {
        return new ParagraphElement(data.name, data.type, data.body);
    }
}
