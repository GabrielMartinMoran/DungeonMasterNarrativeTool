import { WebApiRepository } from './web-api-repository';

export class AuthRepository extends WebApiRepository {
    onLogin = () => {};
    onLogout = () => {};

    async login(credentials: any) {
        const response = await this._post(`/auth/login`, credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('tokenUsername', credentials.username);
        this.onLogin();
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getAuthenticatedUsername(): string {
        return localStorage.getItem('tokenUsername')!;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenUsername');
        this.onLogout();
    }
}
