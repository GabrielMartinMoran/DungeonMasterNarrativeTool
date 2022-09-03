import { IdGenerator } from '../utils/id-generator';
import { NarrativeCategory } from './narrative-category';
import { ArrayUtils } from '../utils/array-utils';
import { createEditorStateWithText } from '@draft-js-plugins/editor';

export class NarrativeContext {
    static TYPES = [
        { type: 'world', name: 'Mundo' },
        { type: 'campaign', name: 'Campaña' },
    ];

    narrativeContextId;
    username;
    type;
    name;
    narrativeCategories;
    isReference = false;

    constructor({ narrativeContextId = null, username, type, name, narrativeCategories = [] }) {
        if (!NarrativeContext.TYPES.find((x) => x.type === type)) throw Error('Invalid type');
        this.narrativeContextId = narrativeContextId ?? IdGenerator.generateId();
        this.username = username;
        this.type = type;
        this.name = name;
        this.narrativeCategories = narrativeCategories;
    }

    getNarrativeCategory(categoryId) {
        return this.narrativeCategories.find((x) => x.id === categoryId);
    }

    addNarrativeCategory(category) {
        this.narrativeCategories.push(category);
    }

    removeNarrativeCategory(categoryId) {
        const category = this.getNarrativeCategory(categoryId);
        this.narrativeCategories.splice(this.narrativeCategories.indexOf(category), 1);
    }

    moveNarrativeCategoryUp(categoryId) {
        const oldIndex = this.narrativeCategories.indexOf(this.narrativeCategories.find((x) => x.id === categoryId));
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        ArrayUtils.moveElementInArray(this.narrativeCategories, oldIndex, newIndex);
    }

    moveNarrativeCategoryDown(categoryId) {
        const oldIndex = this.narrativeCategories.indexOf(this.narrativeCategories.find((x) => x.id === categoryId));
        const newIndex = oldIndex + 1;
        if (newIndex === this.narrativeCategories.length) return;
        ArrayUtils.moveElementInArray(this.narrativeCategories, oldIndex, newIndex);
    }

    searchTerm(term) {
        let elements = [];
        for (const category of this.narrativeCategories) {
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
        for (const category of this.narrativeCategories) {
            if (category.findElementAnywhere(elementId)) {
                return category;
            }
        }
        return null;
    }

    isOnlyReference() {
        return this.isReference;
    }

    toJson() {
        return {
            narrative_context_id: this.narrativeContextId,
            username: this.username,
            type: this.type,
            name: this.name,
            narrative_categories: this.narrativeCategories.map((x) => x.toJson()),
        };
    }

    static fromJson(data) {
        const instance = new NarrativeContext({
            narrativeContextId: data.narrative_context_id,
            username: data.username,
            type: data.type,
            name: data.name,
            narrativeCategories: (data.narrative_categories ?? []).map((x) => NarrativeCategory.fromJson(x)),
        });
        instance.isReference = data.isReference;
        return instance;
    }
}
