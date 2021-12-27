import { NarrativeContext } from '../models/narrative-context';
export class NarrativeContextImporter {
    static importFromJson(narrativeContextJson, appContext) {
        let narrativeContext = null;
        try {
            narrativeContext = NarrativeContext.fromJson(JSON.parse(narrativeContextJson));
        } catch {
            alert('Ha ocurrido un error al importar el contexto narrativo. El formato del archivo no parece ser válido!');
            return;
        }

        const foundExistentNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContext.id);
        if (foundExistentNarrativeContext) {
            alert('Ha ocurrido un error al importar el contexto narrativo. Parece ser que posees otro contexto narrativo con el mismo identificador!')
            return;
        }
        appContext.getDB().addNarrativeContext(narrativeContext);
        alert('La importación fue realizada con éxito!');
        appContext.saveDB();
    }
}