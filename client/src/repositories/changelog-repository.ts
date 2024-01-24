import { WebApiRepository } from './web-api-repository';

export class ChangelogRepository extends WebApiRepository {
    public async get(): Promise<string> {
        return (await this._get('/changelog')).changelog;
    }
}
