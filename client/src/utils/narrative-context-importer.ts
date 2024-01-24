import { AppContext } from '../app-context';
import { getOrInstantiateRepository } from '../hooks/use-repository';
import { NarrativeContext } from '../models/narrative-context';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';

export class NarrativeContextImporter {
    static async importFromJson(narrativeContextJson: any, appContext: AppContext) {
        let narrativeContext = null;
        try {
            narrativeContext = NarrativeContext.fromJson(JSON.parse(narrativeContextJson));
            narrativeContext.regenerateId();
            narrativeContext.username = appContext.authenticatedUser.username;
            narrativeContext.isEditable = true;
        } catch {
            alert(
                'Ha ocurrido un error al importar el contexto narrativo. El formato del archivo no parece ser válido.'
            );
            return;
        }
        getOrInstantiateRepository(NarrativeContextRepository).save(narrativeContext);
        alert('La importación fue realizada con éxito!');
    }
}
