import { NarrativeContext } from '../models/narrative-context';
import { AuthRepository } from '../repositories/auth-repository';

export class NarrativeContextFactory {
    static create(type: string, name: string) {
        return new NarrativeContext(null, new AuthRepository().getAuthenticatedUsername(), type, name, [], false);
    }
}
