import '../styles/ParagraphElementComponent.css';
import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { ParagraphElementComponentBodyRenderer } from './ParagraphElementComponentBodyRenderer';
import { AppContext } from '../app-context';
import { ParagraphElement } from '../models/paragraph-element';

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
    let currentEditorValue: string | null = null;
    let hasChangedAtLeastOneTime = false;

    const edit = () => {
        setEditMode(true);
    };

    const save = () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.body = currentEditorValue;
        const narrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
        appContext.saveNarrativeContext(narrativeContext);
        setEditMode(false);
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

    return (
        <div className="ParagraphElement">
            {editMode ? (
                <>
                    <button onClick={save}>
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
                </>
            ) : (
                <></>
            )}
            {editMode ? (
                <>
                    <RichTextEditor onChange={onBodyChange} initialValue={element.body ?? ''} />
                </>
            ) : (
                <ParagraphElementComponentBodyRenderer appContext={appContext} body={element.body ?? ''} />
            )}
        </div>
    );
};
