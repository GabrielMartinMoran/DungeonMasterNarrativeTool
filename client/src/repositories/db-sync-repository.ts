import { WebApiRepository } from './web-api-repository';
import { Database } from '../models/database';
import { NarrativeContext } from '../models/narrative-context';

export class DBSyncRepository extends WebApiRepository {
    async pullDB() {
        const promises = [this._get('/narrative_contexts'), this._get('/narrative_contexts/shared')];
        const [narrativeContexts, sharedNarrativeContexts] = await Promise.all(promises);

        return new Database({
            narrativeContexts: narrativeContexts.map((x: any) =>
                NarrativeContext.fromJson({ ...x, isReference: true })
            ),
            sharedNarrativeContexts: sharedNarrativeContexts.map((x: any) =>
                NarrativeContext.fromJson({ ...x, isReference: true })
            ),
        });
    }

    async saveNarrativeContext(narrativeContext: NarrativeContext) {
        await this._post('/narrative_contexts', narrativeContext.toJson());
    }

    async getNarrativeContext(narrativeContextId: string) {
        const narrativeContext = await this._get(`/narrative_contexts/${narrativeContextId}`);
        return NarrativeContext.fromJson(narrativeContext);
    }

    async deleteNarrativeContext(narrativeContextId: string) {
        await this._delete(`/narrative_contexts/${narrativeContextId}`);
    }

    async getNarrativeContextSharedUsernames(narrativeContextId: string) {
        return await this._get(`/narrative_contexts/shared/${narrativeContextId}`);
    }

    async shareNarrativeContext(username: string, narrativeContextId: string) {
        await this._post(`/narrative_contexts/share`, {
            username,
            narrative_context_id: narrativeContextId,
        });
    }

    async unshareNarrativeContext(username: string, narrativeContextId: string) {
        await this._post(`/narrative_contexts/unshare`, {
            username,
            narrative_context_id: narrativeContextId,
        });
    }
}
