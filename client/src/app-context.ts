import { NarrativeContext } from './models/narrative-context';
import { DBRepository } from './repositories/db-repository';

export class AppContext {
    _repositories: any;
    _narrativeContextId: string | null = null;
    setUpdatingDBIndicator = (status: boolean) => {};
    elementListItemExpandedStatuses: any = {};

    constructor() {
        this._repositories = {};
    }

    getRepository(repositoryClass: any) {
        if (!this._repositories[repositoryClass]) {
            this._repositories[repositoryClass] = new repositoryClass();
        }
        return this._repositories[repositoryClass];
    }

    // To be overrided
    setBackButtonUrl(url: string | null) {}

    // To be overrided
    setForwardButtonUrl(url: string | null) {}

    // To be overrided
    _setNarrativeContextById(narrativeContextId: string | null) {}

    setNarrativeContextById(narrativeContextId: string | null) {
        this._narrativeContextId = narrativeContextId;
        this._setNarrativeContextById(narrativeContextId);
    }

    getNarrativeContextId() {
        return this._narrativeContextId;
    }

    getDB() {
        return DBRepository._db;
    }

    async getNarrativeContextSharedUsernames(narrativeContextId: string) {
        return await DBRepository._getNarrativeContextSharedUsernames(narrativeContextId);
    }

    async pullNarrativeContext(narrativeContextId: string) {
        await DBRepository._pullNarrativeContext(narrativeContextId);
    }

    async deleteNarrativeContext(narrativeContextId: string) {
        await DBRepository._deleteNarrativeContext(narrativeContextId);
    }

    async saveNarrativeContext(narrativeContext: NarrativeContext) {
        DBRepository.setUpdatingDBIndicator = this.setUpdatingDBIndicator;
        // console.log('Enviando datos al servidor de la aplicación...');
        try {
            await DBRepository._saveNarrativeContext(narrativeContext);
            // console.log('Los datos se enviaron al servidor correctamente!');
        } catch {
            alert('Ha ocurrido un error al tratar de enviar los cambios al servidor de la aplicación!');
        }
    }

    async shareNarrativeContext(username: string, narrativeContextId: string) {
        await DBRepository._shareNarrativeContext(username, narrativeContextId);
    }

    async unshareNarrativeContext(username: string, narrativeContextId: string) {
        await DBRepository._unshareNarrativeContext(username, narrativeContextId);
    }

    // To be overrided
    showSearchBar() {}

    // To be overrided
    hideSearchBar() {}

    triggerEvent(eventName: string) {
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
