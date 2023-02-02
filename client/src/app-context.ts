import { AppContextRepositories } from './app-context-repositories';
import { User } from './models/user';

export class AppContext {
    _narrativeContextId: string | null = null;
    elementListItemExpandedStatuses: any = {};

    protected _setUpdatingDBIndicator = (status: boolean) => {};
    protected _repositories: AppContextRepositories;
    protected _authenticatedUser: User | null = null;
    protected _canOpenSearchBar: boolean = true;
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
            if (this._canOpenSearchBar) this.showSearchBar();
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

    public set setUpdatingDBIndicator(setter: (value: boolean) => void) {
        this._setUpdatingDBIndicator = setter;
        this.repositories.configureUpdatingDBIndicator(setter);
    }

    public get setUpdatingDBIndicator(): (value: boolean) => void {
        return this._setUpdatingDBIndicator;
    }

    public set canOpenSearchBar(value: boolean) {
        this._canOpenSearchBar = value;
    }
}
