import { getOrInstantiateRepository } from './hooks/use-repository';
import { User } from './models/user';
import { AuthRepository } from './repositories/auth-repository';

export class AppContext {
    elementListItemExpandedStatuses: any = {};

    protected _authenticatedUser: User | null = null;
    protected _canOpenSearchBar: boolean = true;
    menuButtonRef: any | null;

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
