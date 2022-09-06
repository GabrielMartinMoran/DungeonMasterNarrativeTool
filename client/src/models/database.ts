import { NarrativeContext } from './narrative-context';

export class Database {
    narrativeContexts: NarrativeContext[];
    sharedNarrativeContexts: NarrativeContext[];

    constructor({ narrativeContexts = [], sharedNarrativeContexts = [] }) {
        this.narrativeContexts = narrativeContexts;
        this.sharedNarrativeContexts = sharedNarrativeContexts;
    }

    getNarrativeContext(narrativeContextId: string): NarrativeContext {
        return this.narrativeContexts.find((x) => x.narrativeContextId === narrativeContextId)!;
    }

    addNarrativeContext(narrativeContext: NarrativeContext) {
        this.narrativeContexts.push(narrativeContext);
    }

    removeNarrativeContext(narrativeContextId: string) {
        const narrativeContext = this.getNarrativeContext(narrativeContextId);
        this.narrativeContexts.splice(this.narrativeContexts.indexOf(narrativeContext), 1);
    }

    getSharedNarrativeContext(narrativeContextId: string): NarrativeContext {
        return this.sharedNarrativeContexts.find((x) => x.narrativeContextId === narrativeContextId)!;
    }

    addSharedNarrativeContext(narrativeContext: NarrativeContext) {
        this.sharedNarrativeContexts.push(narrativeContext);
    }

    removeSharedNarrativeContext(narrativeContextId: string) {
        const narrativeContext = this.getSharedNarrativeContext(narrativeContextId);
        this.sharedNarrativeContexts.splice(this.sharedNarrativeContexts.indexOf(narrativeContext), 1);
    }

    getWorlds() {
        return this.narrativeContexts.filter((x) => x.type === 'world');
    }

    getCampaigns() {
        return this.narrativeContexts.filter((x) => x.type === 'campaign');
    }

    getSharedWorlds() {
        return this.sharedNarrativeContexts.filter((x) => x.type === 'world');
    }

    getSharedCampaigns() {
        return this.sharedNarrativeContexts.filter((x) => x.type === 'campaign');
    }

    searchTerm(term: string, narrativeContextId: string) {
        return this.getNarrativeContext(narrativeContextId).searchTerm(term);
    }
}
