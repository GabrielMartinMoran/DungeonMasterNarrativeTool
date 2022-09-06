import { WebApiRepository } from './web-api-repository';

export class HealthRepository extends WebApiRepository {
    public async checkHealth(): Promise<void> {
        await this._get('/health');
    }
}
