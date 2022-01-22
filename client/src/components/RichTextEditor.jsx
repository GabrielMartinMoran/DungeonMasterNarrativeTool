import React, { useRef } from 'react';
import SunEditor from 'suneditor-react';
import '../styles/RichTextEditor.css';

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
                name: 'Párrafo'
            },
            {
                tag: 'h1',
                name: 'Título'
            },
            {
                tag: 'h2',
                name: 'Subtítulo'
            },
            {
                tag: 'h3',
                name: 'Sección'
            },
            {
                tag: 'blockquote',
                name: 'Bloque de descripción'
            },
            {
                tag: 'pre',
                name: 'Notas de DM'
            },
            //'p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]
    };

    const editor = useRef();

    let currentChangeId = 0;
    const changeUpdateTimeout = 400;

    const getSunEditorInstance = (sunEditor) => {
        editor.current = sunEditor;
    };

    const deferredUpdate = (changeId) => {
        setTimeout(() => {
            if (changeId === currentChangeId) {
                onChange(editor.current.getContents());
            }
        }, changeUpdateTimeout);
    }

    const handleInput = (event) => {
        currentChangeId += 1;
        deferredUpdate(currentChangeId);        
    }

    return <div className="EditorContainer">
        <SunEditor lang='es' defaultValue={initialValue} height='40vh'
            onInput={handleInput} getSunEditorInstance={getSunEditorInstance}
            setOptions={editorOptions} />
    </div >;
}