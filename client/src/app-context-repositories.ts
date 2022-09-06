import { AppContext } from './app-context';
import { AuthRepository } from './repositories/auth-repository';
import { DnD5eCharactersRepository } from './repositories/dnd5e-characters-repository';
import { HealthRepository } from './repositories/health-repository';
import { NarrativeContextRepository } from './repositories/narrative-context-repository';
import { UserRepository } from './repositories/user-repository';

export class AppContextRepositories {
    protected _narrativeContextRepository: NarrativeContextRepository;
    protected _authRepository: AuthRepository;
    protected _dnd5eCharactersRepository: DnD5eCharactersRepository;
    protected _userRepository: UserRepository;
    protected _healthRepository: HealthRepository;

    constructor() {
        this._narrativeContextRepository = new NarrativeContextRepository();
        this._authRepository = new AuthRepository();
        this._dnd5eCharactersRepository = new DnD5eCharactersRepository();
        this._userRepository = new UserRepository();
        this._healthRepository = new HealthRepository();
    }

    public configureUpdatingDBIndicator(setter: (status: boolean) => void) {
        this._narrativeContextRepository.configureUpdatingDBIndicator(setter);
        this._authRepository.configureUpdatingDBIndicator(setter);
        this._dnd5eCharactersRepository.configureUpdatingDBIndicator(setter);
        this._userRepository.configureUpdatingDBIndicator(setter);
        this._healthRepository.configureUpdatingDBIndicator(setter);
    }

    public get narrativeContext(): NarrativeContextRepository {
        return this._narrativeContextRepository;
    }

    public get auth(): AuthRepository {
        return this._authRepository;
    }

    public get dnd5eCharacters(): DnD5eCharactersRepository {
        return this._dnd5eCharactersRepository;
    }

    public get user(): UserRepository {
        return this._userRepository;
    }

    public get health(): HealthRepository {
        return this._healthRepository;
    }
}
