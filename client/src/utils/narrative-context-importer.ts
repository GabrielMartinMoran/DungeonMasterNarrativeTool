import { AppContext } from '../app-context';
import { NarrativeContext } from '../models/narrative-context';
export class NarrativeContextImporter {
    static importFromJson(narrativeContextJson: any, appContext: AppContext) {
        let narrativeContext = null;
        try {
            narrativeContext = NarrativeContext.fromJson(JSON.parse(narrativeContextJson));
        } catch {
            alert(
                'Ha ocurrido un error al importar el contexto narrativo. El formato del archivo no parece ser válido!'
            );
            return;
        }

        const foundExistentNarrativeContext = appContext
            .getDB()
            .getNarrativeContext(narrativeContext.narrativeContextId);
        if (foundExistentNarrativeContext) {
            alert(
                'Ha ocurrido un error al importar el contexto narrativo. Parece ser que posees otro contexto narrativo con el mismo identificador!'
            );
            return;
        }
        appContext.saveNarrativeContext(narrativeContext);
        alert('La importación fue realizada con éxito!');
        appContext.getDB().addNarrativeContext(narrativeContext);
    }
}
