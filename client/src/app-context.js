import { DBRepository } from './repositories/db-repository';

export class AppContext {
    _repositories = null;
    _narrativeContextId = null;
    setUpdatingDBIndicator = (status) => {};
    elementListItemExpandedStatuses = {};

    constructor() {
        this._repositories = {};
    }

    getRepository(repositoryClass) {
        if (!this._repositories[repositoryClass]) {
            this._repositories[repositoryClass] = new repositoryClass();
        }
        return this._repositories[repositoryClass];
    }

    // To be overrided
    setBackButtonUrl(url) {}

    // To be overrided
    setForwardButtonUrl(url) {}

    // To be overrided
    _setNarrativeContextById(narrativeContextId) {}

    setNarrativeContextById(narrativeContextId) {
        this._narrativeContextId = narrativeContextId;
        this._setNarrativeContextById(narrativeContextId);
    }

    getNarrativeContextId() {
        return this._narrativeContextId;
    }

    getDB() {
        return DBRepository._db;
    }

    saveDBAsync() {
        setTimeout(() => this.saveDB(), 0);
    }

    async saveDB() {
        DBRepository.setUpdatingDBIndicator = this.setUpdatingDBIndicator;
        // console.log('Enviando datos al servidor de la aplicación...');
        try {
            await DBRepository._save();
            // console.log('Los datos se enviaron al servidor correctamente!');
        } catch {
            alert('Ha ocurrido un error al tratar de enviar los cambios al servidor de la aplicación!');
        }
    }

    async getNarrativeContextSharedUsernames(narrativeContextId) {
        return await DBRepository._getNarrativeContextSharedUsernames(narrativeContextId);
    }

    async pullNarrativeContext(narrativeContextId) {
        await DBRepository._pullNarrativeContext(narrativeContextId);
    }

    async deleteNarrativeContext(narrativeContextId) {
        await DBRepository._deleteNarrativeContext(narrativeContextId);
    }

    async saveNarrativeContext(narrativeContext) {
        DBRepository.setUpdatingDBIndicator = this.setUpdatingDBIndicator;
        // console.log('Enviando datos al servidor de la aplicación...');
        try {
            await DBRepository._saveNarrativeContext(narrativeContext);
            // console.log('Los datos se enviaron al servidor correctamente!');
        } catch {
            alert('Ha ocurrido un error al tratar de enviar los cambios al servidor de la aplicación!');
        }
    }

    async shareNarrativeContext(username, narrativeContextId) {
        await DBRepository._shareNarrativeContext(username, narrativeContextId);
    }

    async unshareNarrativeContext(username, narrativeContextId) {
        await DBRepository._unshareNarrativeContext(username, narrativeContextId);
    }

    

    // To be overrided
    showSearchBar() {}

    // To be overrided
    hideSearchBar() {}

    triggerEvent(eventName) {
        if (eventName === 'open_search') {
            this.showSearchBar();
            return;
        }
        if (eventName === 'close_search') {
            this.hideSearchBar();
            return;
        }
    }

    // To be overrided
    navigateToPreviousElement() {}
    // To be overrided
    navigateToNextElement() {}
}
