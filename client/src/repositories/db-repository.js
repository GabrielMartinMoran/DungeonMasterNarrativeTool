import { Database } from '../models/database';
import { DBSyncRepository } from './db-sync-repository';

export class DBRepository {
    static _DB_KEY = 'db';
    static _db = null;
    static _afterSaveHooks = [];
    static _preventSave = false;
    static _onDirtyDBCallback = () => {};
    static _dbSyncRepository = new DBSyncRepository();
    static _onCloudDBDownloadedHooks = [];
    static setUpdatingDBIndicator = (value) => {};

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

    registerOnCloudDBDownloadedHook(hook) {
        DBRepository._onCloudDBDownloadedHooks.push(hook);
    }

    static async _save() {
        if (DBRepository._preventSave) {
            DBRepository._onDirtyDBCallback();
            return;
        }
        DBRepository.setUpdatingDBIndicator(true);
        await DBRepository._dbSyncRepository.pushDB(DBRepository._db.toJson());
        DBRepository._callAfterSaveHooks();
        DBRepository.setUpdatingDBIndicator(false);
    }

    static async _pullNarrativeContext(narrativeContextId) {
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

    static async _saveNarrativeContext(narrativeContext) {
        if (DBRepository._preventSave) {
            DBRepository._onDirtyDBCallback();
            return;
        }
        DBRepository.setUpdatingDBIndicator(true);
        await DBRepository._dbSyncRepository.saveNarrativeContext(narrativeContext);
        DBRepository._callAfterSaveHooks();
        DBRepository.setUpdatingDBIndicator(false);
    }

    static async _deleteNarrativeContext(narrativeContextId) {
        await DBRepository._dbSyncRepository.deleteNarrativeContext(narrativeContextId);
    }

    static async _getNarrativeContextSharedUsernames(narrativeContextId) {
        return await DBRepository._dbSyncRepository.getNarrativeContextSharedUsernames(narrativeContextId);
    }

    static async _shareNarrativeContext(username, narrativeContextId) {
        await DBRepository._dbSyncRepository.shareNarrativeContext(username, narrativeContextId);
    }

    static async _unshareNarrativeContext(username, narrativeContextId) {
        await DBRepository._dbSyncRepository.unshareNarrativeContext(username, narrativeContextId);
    }

    registerAfterSaveHook(hook) {
        DBRepository._afterSaveHooks.push(hook);
    }

    static _callAfterSaveHooks() {
        for (const hook of DBRepository._afterSaveHooks) {
            hook();
        }
    }

    registerOnDirtyDBCallback(callback) {
        DBRepository._onDirtyDBCallback = callback;
    }

    enableSavingPrevention() {
        DBRepository._preventSave = true;
    }

    save() {
        DBRepository._save();
    }
}
