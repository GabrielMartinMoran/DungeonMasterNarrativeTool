import { WebApiRepository } from './web-api-repository.js';

export class DnD5eCharactersRepository extends WebApiRepository {

    async getCharacter(characterId) {
        return await this._get(`/dnd_5e/characters/${characterId}`);
    }
}