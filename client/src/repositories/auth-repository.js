import { WebApiRepository } from './web-api-repository.js';

export class AuthRepository extends WebApiRepository {
    
    onLogin = () => {};
    onLogout = () => {};

    async login(credentials) {
        const response = await this._post(`/auth/login`, credentials);
        localStorage.setItem('token', response.token);
        localStorage.setItem('tokenUsername', credentials.username);
        this.onLogin();
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getAuthenticatedUsername() {
        return localStorage.getItem('tokenUsername');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenUsername');
        this.onLogout();
    }
}