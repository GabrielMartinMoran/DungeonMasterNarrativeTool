import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';

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
        appContext.repositories.narrativeContext.save(narrativeContext);
        alert('La importación fue realizada con éxito!');
    }
}
