import { Database } from "../models/database";
import { DBSyncRepository } from './db-sync-repository';

export class DBRepository {

    static _DB_KEY = 'db'
    static _db = null;
    static _afterSaveHooks = [];
    static _preventSave = false;
    static _onDirtyDBCallback = () => { };
    static _dbSyncRepository = new DBSyncRepository();
    static _onCloudDBDownloadedHooks = [];
    static setUpdatingDBIndicator = (value) => {};

    constructor() {
        DBRepository._loadOrCreateLocalDB();
    }

    async tryGetCloudDB() {
        await DBRepository._tryDownloadCloudDB();
    }

    static _loadOrCreateLocalDB() {
        if (DBRepository._db) return;
        const loadedDB = localStorage.getItem(DBRepository._DB_KEY);
        if (!loadedDB) {
            DBRepository._db = new Database();
            DBRepository._save(false);
        } else {
            DBRepository._db = Database.fromJson(JSON.parse(loadedDB));
        }
    }

    static async _tryDownloadCloudDB() {
        console.log('Downloading remote DB');
        const downloadedDB = await DBRepository._dbSyncRepository.pullDB();
        if (downloadedDB) {
            DBRepository._db = downloadedDB;
            DBRepository._save(false);
            for (const hook of DBRepository._onCloudDBDownloadedHooks) {
                hook();
            }
        }
    }

    registerOnCloudDBDownloadedHook(hook) {
        DBRepository._onCloudDBDownloadedHooks.push(hook);
    }

    static async _save(saveInCloud = true) {
        if (DBRepository._preventSave) {
            DBRepository._onDirtyDBCallback();
            return;
        }

        localStorage.setItem(DBRepository._DB_KEY, JSON.stringify(DBRepository._db.toJson()));
        if (saveInCloud) {
            DBRepository._callAfterSaveHooks();
            DBRepository.setUpdatingDBIndicator(true);
            await DBRepository._dbSyncRepository.pushDB(DBRepository._db.toJson());
            DBRepository.setUpdatingDBIndicator(false);
        }
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