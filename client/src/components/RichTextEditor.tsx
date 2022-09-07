import '../styles/RichTextEditor.css';
import React, { useRef } from 'react';
import SunEditor from 'suneditor-react';
import SetOptions from 'suneditor-react/dist/types/SetOptions';

export type RichTextEditorProps = {
    onChange: (value: string) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    initialValue: string;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange, setIsProcessing, initialValue }) => {
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
    } as SetOptions;

    const editor = useRef();

    const getSunEditorInstance = (sunEditor: any) => {
        editor.current = sunEditor;
    };

    const handleInput = (event: any) => {
        setIsProcessing(true);
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
        </div>
    );
};
