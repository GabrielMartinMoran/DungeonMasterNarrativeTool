import Pako from 'pako';
import { WEB_API_URL } from '../config.js';

export class WebApiRepository {
    _get_token() {
        return localStorage.getItem('token');
    }

    async _get(endpoint) {
        const headers = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        const response = await fetch(`${WEB_API_URL}${endpoint}`, {
            method: 'GET',
            headers: headers,
        });
        if (response.ok) return await response.json();
        throw await response.json();
    }

    async _post(endpoint, body) {
        const headers = { 'Content-Type': 'application/json' };
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

        const response = await fetch(`${WEB_API_URL}${endpoint}`, {
            method: 'POST',
            body: data,
            headers: headers,
        });
        if (response.ok) return await response.json();
        throw await response.json();
    }

    async _put(endpoint, body) {
        const headers = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        const response = await fetch(`${WEB_API_URL}${endpoint}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: headers,
        });
        if (response.ok) return await response.json();
        throw await response.json();
    }

    async _delete(endpoint, body) {
        const headers = { 'Content-Type': 'application/json' };
        const authToken = this._get_token();
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        const response = await fetch(`${WEB_API_URL}${endpoint}`, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: headers,
        });
        if (response.ok) return await response.json();
        throw await response.json();
    }
}
