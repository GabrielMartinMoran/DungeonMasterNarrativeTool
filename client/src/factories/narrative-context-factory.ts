import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
import { AuthRepository } from '../repositories/auth-repository';

export class NarrativeContextFactory {
    static create(appContext: AppContext, type: string, name: string) {
        return new NarrativeContext(null, appContext.authenticatedUser.username, type, name, [], false, true);
    }
}
