import { renderToReadableStream } from 'react-dom/server';
import { AppContextRepositories } from './app-context-repositories';
import { NarrativeContext } from './models/narrative-context';
import { User } from './models/user';
import { DBRepository } from './repositories/db-repository';

export class AppContext {
    _narrativeContextId: string | null = null;
    setUpdatingDBIndicator = (status: boolean) => {};
    elementListItemExpandedStatuses: any = {};

    protected _repositories: AppContextRepositories;
    protected _authenticatedUser: User | null = null;
    menuButtonRef: any | null;

    constructor() {
        this._repositories = new AppContextRepositories();
    }

    public get repositories(): AppContextRepositories {
        return this._repositories;
    }

    // To be overrided
    setBackButtonUrl(url: string | null) {}

    // To be overrided
    setForwardButtonUrl(url: string | null) {}

    // To be overrided
    public async _setNarrativeContextById(narrativeContextId: string | null) {}

    public async setNarrativeContextById(narrativeContextId: string | null) {
        this._narrativeContextId = narrativeContextId;
        await this._setNarrativeContextById(narrativeContextId);
    }

    getNarrativeContextId() {
        return this._narrativeContextId;
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

    public async pullAuthenticatedUserInfo() {
        this._authenticatedUser = await this.repositories.auth.getAuthenticatedUser();
    }

    public get authenticatedUser(): User {
        return this._authenticatedUser!;
    }
}
