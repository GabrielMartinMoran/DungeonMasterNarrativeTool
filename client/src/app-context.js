import { DBRepository } from './repositories/db-repository';

export class AppContext {

    _repositories = null;
    setUpdatingDBIndicator = (status) => { };

    constructor() {
        this._repositories = {}
    }

    getRepository(repositoryClass) {
        if (!this._repositories[repositoryClass]) {
            this._repositories[repositoryClass] = new repositoryClass();
        }
        return this._repositories[repositoryClass];
    }

    setBackButtonUrl(url) { }

    setForwardButtonUrl(url) { }

    setNarrativeContextById(narrativeContextId) { }

    getDB() {
        return DBRepository._db;
    }

    async saveDB() {
        DBRepository.setUpdatingDBIndicator = this.setUpdatingDBIndicator;
        console.log('Enviando datos al servidor de la aplicación...');
        try {
            await DBRepository._save();
            console.log('Los datos se enviaron al servidor correctamente!');
        } catch {
            alert('Ha ocurrido un error al tratar de enviar los cambios al servidor de la aplicación!');
        }
    }
}