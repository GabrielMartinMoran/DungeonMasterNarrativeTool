import '../styles/RichTextEditor.css';
import React, { useRef, useState } from 'react';
import SunEditor from 'suneditor-react';
import SunEditorCore from 'suneditor/src/lib/core';
import { SunEditorOptions } from 'suneditor/src/options';
import { AddReferenceSearchModal } from './search/AddReferenceSearchModal';
import { AppContext } from '../app-context';
import { AddReferenceSearchModalResult } from '../types/add-reference-search-modal-result';

export type RichTextEditorProps = {
    appContext: AppContext;
    onChange: (value: string) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    initialValue: string;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    appContext,
    onChange,
    setIsProcessing,
    initialValue,
}) => {
    const [addReferenceModalVisible, setAddReferenceModalVisible] = useState(false);

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
                name: 'Notas del director de juego',
            },
        ],
    } as SunEditorOptions;

    const editor = useRef<SunEditorCore>();

    const getSunEditorInstance = (sunEditor: any) => {
        editor.current = sunEditor;
    };

    const handleInput = (event: any) => {
        setIsProcessing(true);
        if (editor && editor.current && event?.inputType === 'insertText' && event?.data === '@') {
            setAddReferenceModalVisible(true);
        }
    };

    const handleChange = (event: string) => {
        onChange(event);
        setIsProcessing(false);
    };

    const getEditorHeight = () => {
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (height <= 640) return '48vh';
        if (height <= 900) return '67vh';
        return '73vh';
    };

    const onReferenceAdded = async (result: AddReferenceSearchModalResult) => {
        setAddReferenceModalVisible(false);
        if (!editor || !editor.current) return;
        const element = editor.current.util.createElement('a');
        element.setAttribute('href', result.link);
        element.innerHTML = result.name;
        // Remove the @ with the undo
        editor.current.core.history.undo();
        editor.current.core.insertNode(element, undefined, true);
        editor.current.core.history.push(false);
    };

    const onReferenceModalCancel = () => {
        setAddReferenceModalVisible(false);
    };

    return (
        <div className="EditorContainer">
            <SunEditor
                lang="es"
                defaultValue={initialValue}
                height={getEditorHeight()}
                onChange={(state: string) => handleChange(state)}
                onInput={(event) => handleInput(event)}
                getSunEditorInstance={getSunEditorInstance}
                setOptions={editorOptions}
            />
            {addReferenceModalVisible ? (
                <AddReferenceSearchModal
                    appContext={appContext}
                    onSubmit={onReferenceAdded}
                    onCancel={onReferenceModalCancel}
                />
            ) : null}
        </div>
    );
};
