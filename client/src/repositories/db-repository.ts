import { Database } from '../models/database';
import { NarrativeContext } from '../models/narrative-context';
import { DBSyncRepository } from './db-sync-repository';

export class DBRepository {
    static _DB_KEY: string = 'db';
    static _db: Database;
    static _afterSaveHooks: (() => void)[] = [];
    static _preventSave = false;
    static _onDirtyDBCallback: () => void = () => {};
    static _dbSyncRepository = new DBSyncRepository();
    static _onCloudDBDownloadedHooks: (() => void)[] = [];
    static setUpdatingDBIndicator = (value: boolean) => {};

    constructor() {
        DBRepository._db = new Database({
            narrativeContexts: [],
            sharedNarrativeContexts: [],
        });
    }

    async tryGetCloudDB() {
        await DBRepository._tryDownloadCloudDB();
    }

    static async _tryDownloadCloudDB() {
        console.log('Downloading remote DB');
        const downloadedDB = await DBRepository._dbSyncRepository.pullDB();
        if (downloadedDB) {
            DBRepository._db = downloadedDB;
            for (const hook of DBRepository._onCloudDBDownloadedHooks) {
                hook();
            }
        }
    }

    registerOnCloudDBDownloadedHook(hook: () => void) {
        DBRepository._onCloudDBDownloadedHooks.push(hook);
    }

    static async _pullNarrativeContext(narrativeContextId: string) {
        const narrativeContext = await DBRepository._dbSyncRepository.getNarrativeContext(narrativeContextId);
        if (narrativeContext.username === localStorage.getItem('tokenUsername')) {
            if (DBRepository._db.getNarrativeContext(narrativeContextId))
                DBRepository._db.removeNarrativeContext(narrativeContextId);
            DBRepository._db.addNarrativeContext(narrativeContext);
        } else {
            if (DBRepository._db.getSharedNarrativeContext(narrativeContextId))
                DBRepository._db.removeSharedNarrativeContext(narrativeContextId);
            DBRepository._db.addSharedNarrativeContext(narrativeContext);
        }
    }

    static async _saveNarrativeContext(narrativeContext: NarrativeContext) {
        if (DBRepository._preventSave) {
            DBRepository._onDirtyDBCallback();
            return;
        }
        DBRepository.setUpdatingDBIndicator(true);
        await DBRepository._dbSyncRepository.saveNarrativeContext(narrativeContext);
        DBRepository._callAfterSaveHooks();
        DBRepository.setUpdatingDBIndicator(false);
    }

    static async _deleteNarrativeContext(narrativeContextId: string) {
        await DBRepository._dbSyncRepository.deleteNarrativeContext(narrativeContextId);
    }

    static async _getNarrativeContextSharedUsernames(narrativeContextId: string) {
        return await DBRepository._dbSyncRepository.getNarrativeContextSharedUsernames(narrativeContextId);
    }

    static async _shareNarrativeContext(username: string, narrativeContextId: string) {
        await DBRepository._dbSyncRepository.shareNarrativeContext(username, narrativeContextId);
    }

    static async _unshareNarrativeContext(username: string, narrativeContextId: string) {
        await DBRepository._dbSyncRepository.unshareNarrativeContext(username, narrativeContextId);
    }

    static _callAfterSaveHooks() {
        for (const hook of DBRepository._afterSaveHooks) {
            hook();
        }
    }

    registerAfterSaveHook(hook: () => void) {
        DBRepository._afterSaveHooks.push(hook);
    }

    registerOnDirtyDBCallback(callback: () => void) {
        DBRepository._onDirtyDBCallback = callback;
    }

    enableSavingPrevention() {
        DBRepository._preventSave = true;
    }
}
