import React, { useState } from 'react';
import { DBRepository } from '../repositories/db-repository';
import { RichTextEditor } from './RichTextEditor';
import '../styles/ParagraphElementComponent.css';

export function ParagraphElementComponent({ appContext, element, parentExposedFuntions }) {

    const [editMode, setEditMode] = useState(false);
    let currentEditorValue = null;
    let hasChangedAtLeastOneTime = false;

    const edit = () => {
        setEditMode(true);
    }

    const save = () => {
        if (!hasChangedAtLeastOneTime) {
            discardChanges();
            return;
        }
        element.body = currentEditorValue;
        appContext.saveDBAsync();
        setEditMode(false);
    }

    const discardChanges = () => {
        currentEditorValue = null;
        setEditMode(false);
    }

    const onBodyChange = (value) => {
        hasChangedAtLeastOneTime = true;
        currentEditorValue = value;
    }

    parentExposedFuntions.edit = edit;

    return <div className="ParagraphElement">
        {
            editMode ? <>
                <button onClick={save}>
                    <span role='img' aria-label='save'>💾</span> Guardar cambios
                </button>
                <button onClick={discardChanges}>
                    <span role='img' aria-label='cancel'>❌</span> Descartar cambios
                </button>
            </> : <></>
        }
        <br></br>
        {
            editMode ?
                <>
                    <RichTextEditor onChange={onBodyChange} initialValue={element.body} />
                </> :
                <div dangerouslySetInnerHTML={{ __html: element.body }} />

        }
    </div>;
}