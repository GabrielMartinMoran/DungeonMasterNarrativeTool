import { IdGenerator } from '../utils/id-generator';
import { NarrativeCategory } from './narrative-category';
import { ArrayUtils } from '../utils/array-utils';
import { BaseElement } from './base-element';

export class NarrativeContext {
    static CAMPAIGN_TYPE = 'campaign';
    static WORLD_TYPE = 'world';
    static TYPES: any[] = [
        { type: this.WORLD_TYPE, name: 'Mundo' },
        { type: this.CAMPAIGN_TYPE, name: 'Campaña' },
    ];

    narrativeContextId: string;
    username: string;
    type: string;
    name: string;
    narrativeCategories: NarrativeCategory[];
    isReference: boolean;
    isEditable: boolean;

    constructor(
        narrativeContextId: string | null,
        username: string,
        type: string,
        name: string,
        narrativeCategories: NarrativeCategory[] = [],
        isReference: boolean = false,
        isEditable: boolean = false
    ) {
        if (!NarrativeContext.TYPES.find((x: any) => x.type === type)) throw Error('Invalid type');
        this.narrativeContextId = narrativeContextId ?? IdGenerator.generateId();
        this.username = username;
        this.type = type;
        this.name = name;
        this.narrativeCategories = narrativeCategories;
        this.isReference = isReference;
        this.isEditable = isEditable;
    }

    getNarrativeCategory(categoryId: string): NarrativeCategory {
        return this.narrativeCategories.find((x) => x.id === categoryId)!;
    }

    addNarrativeCategory(category: NarrativeCategory): void {
        this.narrativeCategories.push(category);
    }

    removeNarrativeCategory(categoryId: string): void {
        const category = this.getNarrativeCategory(categoryId);
        this.narrativeCategories.splice(this.narrativeCategories.indexOf(category), 1);
    }

    moveNarrativeCategoryUp(categoryId: string): void {
        const oldIndex = this.narrativeCategories.indexOf(this.narrativeCategories.find((x) => x.id === categoryId)!);
        const newIndex = oldIndex - 1;
        if (oldIndex === 0) return;
        ArrayUtils.moveElementInArray(this.narrativeCategories, oldIndex, newIndex);
    }

    moveNarrativeCategoryDown(categoryId: string): void {
        const oldIndex = this.narrativeCategories.indexOf(this.narrativeCategories.find((x) => x.id === categoryId)!);
        const newIndex = oldIndex + 1;
        if (newIndex === this.narrativeCategories.length) return;
        ArrayUtils.moveElementInArray(this.narrativeCategories, oldIndex, newIndex);
    }

    searchTerm(term: string): BaseElement[] {
        let elements: BaseElement[] = [];
        for (const category of this.narrativeCategories) {
            elements = elements.concat(category.getPlainViewableElements());
        }
        const cleanStr = (str: string) => {
            return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };
        return elements.filter((element) => cleanStr(element.name).includes(cleanStr(term)));
    }

    getNarrativeCategoryByElementId(elementId: string): NarrativeCategory | null {
        for (const category of this.narrativeCategories) {
            if (category.findElementAnywhere(elementId)) {
                return category;
            }
        }
        return null;
    }

    getElementById(elementId: string): BaseElement | null {
        for (const category of this.narrativeCategories) {
            const element = category.findElementAnywhere(elementId);
            if (element) return element;
        }
        return null;
    }

    isOnlyReference(): boolean {
        return this.isReference;
    }

    public isCampaign(): boolean {
        return this.type === NarrativeContext.CAMPAIGN_TYPE;
    }

    public isWorld(): boolean {
        return this.type === NarrativeContext.WORLD_TYPE;
    }

    public regenerateId(): void {
        this.narrativeContextId = IdGenerator.generateId();
    }

    toJson(): any {
        return {
            narrative_context_id: this.narrativeContextId,
            username: this.username,
            type: this.type,
            name: this.name,
            narrative_categories: this.narrativeCategories.map((x) => x.toJson()),
        };
    }

    static fromJson(data: any) {
        return new NarrativeContext(
            data.narrative_context_id,
            data.username,
            data.type,
            data.name,
            (data.narrative_categories ?? []).map((x: any) => NarrativeCategory.fromJson(x)),
            data.isReference,
            data.isEditable
        );
    }
}
