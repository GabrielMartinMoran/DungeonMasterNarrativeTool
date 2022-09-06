import { User } from '../models/user';
import { WebApiRepository } from './web-api-repository';

export class UserRepository extends WebApiRepository {
    public async list(): Promise<User[]> {
        const response = await this._get('/users');
        return response.map((x: any) => User.fromDict(x));
    }

    public async changePassword(username: string, password: string): Promise<void> {
        return await this._put('/users/password', { username, password });
    }

    public async create(username: string, name: string, password: string, role: string): Promise<void> {
        return await this._post('/users', { username, name, password, role });
    }

    public async delete(username: string): Promise<void> {
        return await this._delete(`/users/${username}`);
    }

    public async changeName(username: string, name: string): Promise<void> {
        return await this._put('/users/name', { username, name });
    }
}
