import { WebApiRepository } from "./web-api-repository";

export class DnD5eCharactersRepository extends WebApiRepository {
    static _characters: any = {};

    async getCharacter(characterId: string) {
        if (!DnD5eCharactersRepository._characters[characterId]) {
            DnD5eCharactersRepository._characters[characterId] = await this._get(`/dnd_5e/characters/${characterId}`);
        }
        return DnD5eCharactersRepository._characters[characterId];
    }
}
