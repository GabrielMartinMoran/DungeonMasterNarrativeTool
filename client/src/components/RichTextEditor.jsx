import '../styles/RichTextEditor.css';
import React, { useRef } from 'react';
import SunEditor from 'suneditor-react';

export function RichTextEditor({ onChange, initialValue }) {
    const editorOptions = {
        buttonList: [
            ['formatBlock', 'bold', 'underline', 'italic', 'strike'],
            ['fontColor', 'hiliteColor'],
            ['removeFormat'],
            ['align', 'horizontalRule', 'list'],
            ['table', 'link', 'image', 'video', 'audio'],
            ['fullScreen', 'codeView'],
        ],
        formats: [
            {
                tag: 'p',
                name: 'Párrafo',
            },
            {
                tag: 'h1',
                name: 'Título',
            },
            {
                tag: 'h2',
                name: 'Subtítulo',
            },
            {
                tag: 'h3',
                name: 'Sección',
            },
            {
                tag: 'h4',
                name: 'Subsección',
            },
            {
                tag: 'blockquote',
                name: 'Bloque de descripción',
            },
            {
                tag: 'pre',
                name: 'Notas de DM',
            },
            //'p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ],
    };

    const editor = useRef();

    let currentChangeId = 0;
    const changeUpdateTimeout = 200;

    const getSunEditorInstance = (sunEditor) => {
        editor.current = sunEditor;
    };

    const deferredUpdate = (changeId) => {
        setTimeout(() => {
            if (changeId === currentChangeId) {
                // Sometimes the ref does not have getContents function, in that case we skip this deferred update
                if (!editor.current.getContents) return;
                onChange(editor.current.getContents());
            }
        }, changeUpdateTimeout);
    };

    const handleInput = () => {
        currentChangeId += 1;
        deferredUpdate(currentChangeId);
    };

    const getEditorHeight = () => {
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (height <= 640) return '48vh';
        if (height <= 900) return '67vh';
        return '73vh';
    };

    return (
        <div className="EditorContainer">
            <SunEditor
                lang="es"
                defaultValue={initialValue}
                height={getEditorHeight()}
                onChange={(state) => handleInput()}
                onInput={(event) => handleInput()}
                getSunEditorInstance={getSunEditorInstance}
                setOptions={editorOptions}
            />
        </div>
    );
}
