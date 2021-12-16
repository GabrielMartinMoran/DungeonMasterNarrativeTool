import { Database } from "../models/database";

export class DBRepository {

    static _DB_KEY = 'db'
    static _db = null;
    static _afterSaveHooks = [];
    static _preventSave = false;
    static _onDirtyDBCallback = () => {};

    constructor() {
        DBRepository._loadOrCreateDB();
    }

    static _loadOrCreateDB() {
        if (DBRepository._db) return;
        const loadedDB = localStorage.getItem(DBRepository._DB_KEY);
        if (!loadedDB) {
            DBRepository._db = new Database();
            DBRepository._save();
        } else {
            DBRepository._db = Database.fromJson(JSON.parse(loadedDB));
        }
    }

    static _save() {
        if (DBRepository._preventSave) {
            DBRepository._onDirtyDBCallback();
            return;
        }

        localStorage.setItem(DBRepository._DB_KEY, JSON.stringify(DBRepository._db.toJson()));
        DBRepository._callAfterSaveHooks();
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

    getDB() {
        return DBRepository._db;
    }

}