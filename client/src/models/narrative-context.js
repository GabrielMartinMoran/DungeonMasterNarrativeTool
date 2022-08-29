import { IdGenerator } from '../utils/id-generator';
import { NarrativeCategory } from './narrative-category';
import { ArrayUtils } from '../utils/array-utils';
import { createEditorStateWithText } from '@draft-js-plugins/editor';

export class NarrativeContext {
    static TYPES = [
        { type: 'world', name: 'Mundo' },
        { type: 'campaign', name: 'Campaña' },
    ];

    id = null;
    type = null;
    name = null;
    categories = null;

    constructor(type, name) {
        if (!NarrativeContext.TYPES.find((x) => x.type === type)) throw Error('Invalid type');
        this.id = IdGenerator.generateId();
        this.type = type;
        this.name = name;
        this.categories = [];
    }

    getNarrativeCategory(categoryId) {
        return this.categories.find((x) => x.id === categoryId);
    }

    addNarrativeCategory(category) {
        this.categories.push(category);
    }

    removeNarrativeCategory(categoryId) {
        const category = this.getNarrativeCategory(categoryId);
        this.categories.splice(this.categories.indexOf(category), 1);
    }

    moveNarrativeCategoryUp(categoryId) {
        const oldIndex = this.categories.indexOf(this.categories.find((x) => x.id === categoryId));
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        ArrayUtils.moveElementInArray(this.categories, oldIndex, newIndex);
    }

    moveNarrativeCategoryDown(categoryId) {
        const oldIndex = this.categories.indexOf(this.categories.find((x) => x.id === categoryId));
        const newIndex = oldIndex + 1;
        if (newIndex === this.categories.length) return;
        ArrayUtils.moveElementInArray(this.categories, oldIndex, newIndex);
    }

    searchTerm(term) {
        let elements = [];
        for (const category of this.categories) {
            elements = elements.concat(category.getPlainViewableElements());
        }
        const cleanStr = (str) => {
            return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };
        return elements.filter((element) => cleanStr(element.name).includes(cleanStr(term)));
    }

    getNarrativeCategoryByElementId(elementId) {
        for (const category of this.categories) {
            if (category.findElementAnywhere(elementId)) {
                return category;
            }
        }
        return null;
    }

    toJson() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            categories: this.categories.map((x) => x.toJson()),
        };
    }

    static fromJson(data) {
        const instance = new NarrativeContext(data['type'], data['name']);
        instance.id = data['id'];
        instance.categories = data['categories'].map((x) => NarrativeCategory.fromJson(x));
        return instance;
    }
}
