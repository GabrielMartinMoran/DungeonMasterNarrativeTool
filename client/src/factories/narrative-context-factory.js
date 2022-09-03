import { NarrativeContext } from 'models/narrative-context';
import { AuthRepository } from 'repositories/auth-repository';

export class NarrativeContextFactory {
    static create(type, name) {
        return new NarrativeContext({ username: new AuthRepository().getAuthenticatedUsername(), type, name });
    }
}
