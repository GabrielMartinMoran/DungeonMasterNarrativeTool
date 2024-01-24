import { getOrInstantiateRepository } from './hooks/use-repository';
import { User } from './models/user';
import { AuthRepository } from './repositories/auth-repository';

export class AppContext {
    elementListItemExpandedStatuses: any = {};

    protected _authenticatedUser: User | null = null;
    protected _canOpenSearchBar: boolean = true;
    menuButtonRef: any | null;

    // These callbacks are intended to be overriden
    dynamicCallbacks = {
        showSearchBar: () => {},
        hideSearchBar: () => {},
        hideAddReferenceSearchModal: () => {},
    };

    // To be overrided
    showSearchBar() {}

    // To be overrided
    hideSearchBar() {}

    // To be overrided
    hideAddReferenceSearchModal() {}

    triggerEvent(eventName: string) {
        if (eventName === 'open_search') {
            if (this._canOpenSearchBar) this.showSearchBar();
            return;
        }
        if (eventName === 'close_search') {
            this.hideSearchBar();
            return;
        }
        if (eventName === 'close_add_reference') {
            this.hideAddReferenceSearchModal();
            return;
        }
    }

    // To be overrided
    navigateToPreviousElement() {}
    // To be overrided
    navigateToNextElement() {}

    public async pullAuthenticatedUserInfo() {
        this._authenticatedUser = await getOrInstantiateRepository(AuthRepository).getAuthenticatedUser();
    }

    public get authenticatedUser(): User {
        return this._authenticatedUser!;
    }

    public set canOpenSearchBar(value: boolean) {
        this._canOpenSearchBar = value;
    }
}
