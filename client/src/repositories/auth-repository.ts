import { User } from '../models/user';
import { WebApiRepository } from './web-api-repository';

export class AuthRepository extends WebApiRepository {
    protected authUserCache: Map<string, User>;
    onLogin = () => {};
    onLogout = () => {};

    constructor() {
        super();
        this.authUserCache = new Map<string, User>();
    }

    async login(credentials: any) {
        const response = await this._post(`/auth/login`, credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('tokenUsername', credentials.username);
        this.onLogin();
    }

    public isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    public getAuthenticatedUsername(): string | null {
        return localStorage.getItem('tokenUsername');
    }

    public logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenUsername');
        this.onLogout();
    }

    public async getAuthenticatedUser(): Promise<User | null> {
        const username = this.getAuthenticatedUsername();
        if (!username) return null;
        if (!this.authUserCache.has(username)) {
            const response = await this._get(`/users/logged`);
            const user = User.fromDict(response);
            this.authUserCache.set(username, user);
        }
        return this.authUserCache.get(username)!;
    }

    public async changePassword(password: string): Promise<void> {
        await this._put('/auth/password', { password });
    }
}
