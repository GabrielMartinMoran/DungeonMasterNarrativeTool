import '../styles/ParagraphElementComponent.css';
import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { ParagraphElementComponentBodyRenderer } from './ParagraphElementComponentBodyRenderer';
import { AppContext } from '../app-context';
import { ParagraphElement } from '../models/paragraph-element';
import { DirtyDBError } from '../errors/dirty-db-error';
import { useRepository } from '../hooks/use-repository';
import { NarrativeContextRepository } from '../repositories/narrative-context-repository';

let currentEditorValue: string | null = null;
let hasChangedAtLeastOneTime = false;

export type ParagraphElementComponentProps = {
    appContext: AppContext;
    narrativeContextId: string;
    element: ParagraphElement;
    parentExposedFunctions: any;
};

export const ParagraphElementComponent: React.FC<ParagraphElementComponentProps> = ({
    appContext,
    narrativeContextId,
    element,
    parentExposedFunctions,
}) => {
    const [editMode, setEditMode] = useState(false);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);

    const edit = () => {
        currentEditorValue = element.body;
        hasChangedAtLeastOneTime = false;
        appContext.canOpenSearchBar = false;
        setEditMode(true);
    };

    const save = async () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.body = currentEditorValue;

        // Disable buttons while saving
        const saveBtn = document.querySelector('#saveBtn');
        if (saveBtn) (saveBtn as any).disabled = true;
        const cancelBtn = document.querySelector('#cancelBtn');
        if (cancelBtn) (cancelBtn as any).disabled = true;

        const narrativeContext = await narrativeContextRepository.get(narrativeContextId);
        let shouldReload = false;

        // Catch Dirty DB Errors in case of dirty reads
        try {
            shouldReload = await narrativeContextRepository.save(narrativeContext);
        } catch (err) {
            if (err instanceof DirtyDBError) {
                if (cancelBtn) (cancelBtn as any).disabled = false;
                return;
            }
            throw err;
        }

        appContext.canOpenSearchBar = true;

        if (shouldReload) {
            window.location.reload();
        } else {
            // To prevent blocking the app due to rendering non lightweighted images,
            // we only remove edit mode if reload is not needed
            setEditMode(false);
        }
    };

    const discardChanges = () => {
        appContext.canOpenSearchBar = true;
        currentEditorValue = null;
        setEditMode(false);
    };

    const onBodyChange = (value: string) => {
        hasChangedAtLeastOneTime = true;
        currentEditorValue = value;
    };

    parentExposedFunctions.edit = edit;

    const setIsProcessing = (isProcessing: boolean) => {
        // We update using this instead of an state because on mobile refreshing the dom using react
        //  causes the keyboard to hide
        const btn = document.querySelector('#saveBtn');
        if (btn) (btn as any).disabled = isProcessing;
    };

    return (
        <div className="ParagraphElement">
            {editMode ? (
                <div>
                    <button id="saveBtn" onClick={save}>
                        <span role="img" aria-label="save">
                            💾
                        </span>{' '}
                        Guardar cambios
                    </button>
                    <button id="cancelBtn" onClick={discardChanges}>
                        <span role="img" aria-label="cancel">
                            ❌
                        </span>{' '}
                        Descartar cambios
                    </button>
                </div>
            ) : (
                <></>
            )}
            {editMode ? (
                <>
                    <RichTextEditor
                        appContext={appContext}
                        onChange={onBodyChange}
                        initialValue={element.body ?? ''}
                        setIsProcessing={setIsProcessing}
                    />
                </>
            ) : (
                <ParagraphElementComponentBodyRenderer appContext={appContext} body={element.body ?? ''} />
            )}
        </div>
    );
};
