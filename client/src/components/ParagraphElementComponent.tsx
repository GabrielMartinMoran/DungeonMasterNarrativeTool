import '../styles/ParagraphElementComponent.css';
import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { ParagraphElementComponentBodyRenderer } from './ParagraphElementComponentBodyRenderer';
import { AppContext } from '../app-context';
import { ParagraphElement } from '../models/paragraph-element';

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

    const edit = () => {
        currentEditorValue = element.body;
        hasChangedAtLeastOneTime = false;
        setEditMode(true);
    };

    const save = async () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.body = currentEditorValue;
        const narrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId);
        const shouldReload = await appContext.repositories.narrativeContext.save(narrativeContext);
        setEditMode(false);
        if (shouldReload) window.location.reload();
    };

    const discardChanges = () => {
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
                    <button onClick={discardChanges}>
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
