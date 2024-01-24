import { WEB_API_URL } from '../config';
import { ConnectionError } from '../errors/connection-error';
import { loadingIndicatorCallback } from '../hooks/use-loading-indicator';
import { Repository } from './repository';
const Pako = require('pako');

export class WebApiRepository implements Repository {
    protected _get_token() {
        return localStorage.getItem('token');
    }

    protected async _get(endpoint: string) {
        const headers: any = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }

        try {
            this.setUpdatingIndicator(true);
            const response = await fetch(`${WEB_API_URL}${endpoint}`, {
                method: 'GET',
                headers: headers,
            });
            this.setUpdatingIndicator(false);
            if (response.ok) return await response.json();
            await this.throwResponseError(response);
        } catch (e) {
            this.setUpdatingIndicator(false);
            this.throwConnectionError();
        }
    }

    protected async _post(endpoint: string, body: any) {
        const headers: any = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        let stringBody = JSON.stringify(body);
        let data = null;
        if (typeof stringBody === 'string' && stringBody.length > 1024) {
            headers['Content-Encoding'] = 'gzip';
            data = Pako.gzip(stringBody);
        } else {
            // delete is slow apparently, faster to set to undefined
            headers['Content-Encoding'] = undefined;
            data = stringBody;
        }
        try {
            this.setUpdatingIndicator(true);
            const response = await fetch(`${WEB_API_URL}${endpoint}`, {
                method: 'POST',
                body: data,
                headers: headers,
            });
            this.setUpdatingIndicator(false);
            if (response.ok) return await response.json();
            await this.throwResponseError(response);
        } catch (e) {
            this.setUpdatingIndicator(false);
            this.throwConnectionError();
        }
    }

    protected async _put(endpoint: string, body: any) {
        const headers: any = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }

        try {
            this.setUpdatingIndicator(true);
            const response = await fetch(`${WEB_API_URL}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: headers,
            });
            this.setUpdatingIndicator(false);
            if (response.ok) return await response.json();
            await this.throwResponseError(response);
        } catch (e) {
            this.setUpdatingIndicator(false);
            this.throwConnectionError();
        }
    }

    protected async _delete(endpoint: string) {
        const headers: any = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }

        try {
            this.setUpdatingIndicator(true);
            const response = await fetch(`${WEB_API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers,
            });

            this.setUpdatingIndicator(false);
            if (response.ok) return await response.json();
            await this.throwResponseError(response);
        } catch (e) {
            this.setUpdatingIndicator(false);
            this.throwConnectionError();
        }
    }

    private async throwResponseError(response: Response) {
        const data = await response.json();
        throw data;
    }

    private throwConnectionError() {
        throw new ConnectionError('Ha ocurrido un error al tratar de conectar con el servidor');
    }

    private setUpdatingIndicator(status: boolean) {
        loadingIndicatorCallback(status);
    }
}
