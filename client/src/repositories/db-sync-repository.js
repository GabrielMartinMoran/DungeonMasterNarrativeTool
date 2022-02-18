import { WebApiRepository } from './web-api-repository';
import { Database } from '../models/database';

export class DBSyncRepository extends WebApiRepository {

    async pullDB() {
        const db = await this._get('/database');
        if (Object.keys(db).length === 0) return null;
        return Database.fromJson(db);
    }

    async pushDB(dbJson) {
        await this._post('/database', dbJson);
    }
}