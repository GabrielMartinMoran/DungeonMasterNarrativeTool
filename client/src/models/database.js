import { NarrativeContext } from './narrative-context';

export class Database {
    campaigns = null; // Array of NarrativeContext
    worlds = null; // Array of NarrativeContext
    narrativeContexts = null;
    sharedNarrativeContexts = null;

    constructor({ narrativeContexts = [], sharedNarrativeContexts = [] }) {
        this.campaigns = [];
        this.worlds = [];
        this.narrativeContexts = narrativeContexts;
        this.sharedNarrativeContexts = sharedNarrativeContexts;
    }

    getNarrativeContext(narrativeContextId) {
        return this.narrativeContexts.find((x) => x.narrativeContextId === narrativeContextId);
    }

    addNarrativeContext(narrativeContext) {
        this.narrativeContexts.push(narrativeContext);
    }

    removeNarrativeContext(narrativeContextId) {
        const narrativeContext = this.getNarrativeContext(narrativeContextId);
        this.narrativeContexts.splice(this.narrativeContexts.indexOf(narrativeContext), 1);
    }

    getSharedNarrativeContext(narrativeContextId) {
        return this.sharedNarrativeContexts.find((x) => x.narrativeContextId === narrativeContextId);
    }

    addSharedNarrativeContext(narrativeContext) {
        this.sharedNarrativeContexts.push(narrativeContext);
    }

    removeSharedNarrativeContext(narrativeContextId) {
        const narrativeContext = this.getSharedNarrativeContext(narrativeContextId);
        this.sharedNarrativeContexts.splice(this.sharedNarrativeContexts.indexOf(narrativeContext), 1);
    }

    addWorld(world) {
        this.worlds.push(world);
    }

    addCampaign(campaign) {
        this.campaigns.push(campaign);
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

    toJson() {
        return {
            campaigns: this.campaigns.map((x) => x.toJson()),
            worlds: this.worlds.map((x) => x.toJson()),
        };
    }

    static fromJson(data) {
        const instance = new Database();
        instance.campaigns = data['campaigns'].map((x) => NarrativeContext.fromJson(x));
        instance.worlds = data['worlds'].map((x) => NarrativeContext.fromJson(x));
        return instance;
    }

    searchTerm(term, narrativeContextId) {
        return this.getNarrativeContext(narrativeContextId).searchTerm(term);
    }
}
