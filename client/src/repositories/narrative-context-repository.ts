import { NarrativeContext } from '../models/narrative-context';
import { WebApiRepository } from './web-api-repository';

export class NarrativeContextRepository extends WebApiRepository {
    protected cache: Map<string, NarrativeContext>;
    protected _afterSaveHooks: (() => void)[];
    protected _onDirtyDBCallback: () => void = () => {};
    protected _preventSave: boolean = false;

    constructor() {
        super();
        this.cache = new Map<string, NarrativeContext>();
        this._afterSaveHooks = [];
    }

    public async list(): Promise<NarrativeContext[]> {
        const response: any[] = await this._get('/narrative_contexts');
        return response.map((x: any) => NarrativeContext.fromJson({ ...x, isReference: true }));
    }

    public async listShared(): Promise<NarrativeContext[]> {
        const response: any[] = await this._get('/narrative_contexts/shared');
        return response.map((x: any) => NarrativeContext.fromJson({ ...x, isReference: true }));
    }

    public async get(narrativeContextId: string): Promise<NarrativeContext> {
        if (!this.cache.has(narrativeContextId)) {
            // This endpoint raises a 404 if the narrative context does not exist
            const response = await this._get(`/narrative_contexts/${narrativeContextId}`);
            const narrativeContext = NarrativeContext.fromJson({
                ...response,
                isEditable: response.username === localStorage.getItem('tokenUsername'),
            });
            this.cache.set(narrativeContextId, narrativeContext);
        }
        return this.cache.get(narrativeContextId)!;
    }

    public async save(narrativeContext: NarrativeContext): Promise<boolean> {
        /**
         * Returns true if a reload is suggested
         */
        if (this._preventSave) {
            this._onDirtyDBCallback();
            return false;
        }
        const result = await this._post('/narrative_contexts', narrativeContext.toJson());
        // We update the cache after saving successfully
        this.cache.set(narrativeContext.narrativeContextId, narrativeContext);
        for (const hook of this._afterSaveHooks) {
            hook();
        }
        return result.reload_suggested;
    }

    public async delete(narrativeContextId: string): Promise<void> {
        if (this._preventSave) {
            this._onDirtyDBCallback();
            return;
        }
        await this._delete(`/narrative_contexts/${narrativeContextId}`);
        if (this.cache.has(narrativeContextId)) this.cache.delete(narrativeContextId);
    }

    public async getSharedUsernames(narrativeContextId: string) {
        return await this._get(`/narrative_contexts/shared/${narrativeContextId}`);
    }

    public async share(usernameToShareWith: string, narrativeContextId: string) {
        await this._post(`/narrative_contexts/share`, {
            username: usernameToShareWith,
            narrative_context_id: narrativeContextId,
        });
    }

    public async unshare(usernameToUnshareFrom: string, narrativeContextId: string) {
        await this._post(`/narrative_contexts/unshare`, {
            username: usernameToUnshareFrom,
            narrative_context_id: narrativeContextId,
        });
    }

    public registerAfterSaveHook(hook: () => void) {
        this._afterSaveHooks.push(hook);
    }

    public registerOnDirtyDBCallback(callback: () => void) {
        this._onDirtyDBCallback = callback;
    }

    enableSavingPrevention() {
        this._preventSave = true;
    }
}
