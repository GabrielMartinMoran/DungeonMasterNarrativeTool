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

    getDB() {
        return this.getRepository(DBRepository).getDB();
    }

    saveDB() {
        this.getRepository(DBRepository).save();
    }
}