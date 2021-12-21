import { DBRepository } from './repositories/db-repository';

export class AppContext {

    _repositories = null;
    
    constructor() {
        this._repositories = {}
    }

    getRepository(repositoryClass) {
        if (!this._repositories[repositoryClass]){
            this._repositories[repositoryClass] = new repositoryClass();
        }
        return this._repositories[repositoryClass];
    }

    setBackButtonUrl(url) {}

    setForwardButtonUrl(url) {}

    setNarrativeContextById(narrativeContextId) {}

    getDB() {
        return DBRepository._db;
    }

    saveDB() {
        DBRepository._save();
    }
}