import { NarrativeContext } from './narrative-context';

export class Database {

    campaigns = null; // Array of NarrativeContext
    worlds = null; // Array of NarrativeContext

    constructor() {
        this.campaigns = [];
        this.worlds = []; 
    }

    getNarrativeContext(narrativeContextId) {
        return this.campaigns.concat(this.worlds).find(x => x.id === narrativeContextId);
    }

    addNarrativeContext(narrativeContext) {
        if (narrativeContext.type === 'world') {
            this.addWorld(narrativeContext);
        } else {
            this.addCampaign(narrativeContext);
        }
    }

    removeNarrativeContext(narrativeContextId) {
        const narrativeContext = this.getNarrativeContext(narrativeContextId);
        let narrativeContextsList = null;
        if (narrativeContext.type === 'world') {
            narrativeContextsList = this.worlds;
        } else {
            narrativeContextsList = this.campaigns;
        }
        narrativeContextsList.splice(narrativeContextsList.indexOf(narrativeContext), 1);
    }

    addWorld(world) {
        this.worlds.push(world);
    }

    addCampaign(campaign) {
        this.campaigns.push(campaign);
    }

    toJson() {
        return {
            campaigns: this.campaigns.map(x => x.toJson()),
            worlds: this.worlds.map(x => x.toJson())
        }
    }

    static fromJson(data) {
        const instance = new Database();
        instance.campaigns = data['campaigns'].map(x => NarrativeContext.fromJson(x));
        instance.worlds = data['worlds'].map(x => NarrativeContext.fromJson(x));
        return instance;
    }

}