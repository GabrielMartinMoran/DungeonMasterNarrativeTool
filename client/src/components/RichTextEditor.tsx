import '../styles/RichTextEditor.css';
import React, { useEffect, useRef } from 'react';
import SunEditor from 'suneditor-react';
import SunEditorCore, { Core } from 'suneditor/src/lib/core';
import { SunEditorOptions } from 'suneditor/src/options';
import { AddReferenceSearchModal } from './search/AddReferenceSearchModal';
import { AppContext } from '../app-context';
import { AddReferenceSearchModalResult } from '../types/add-reference-search-modal-result';
import { useAddReferenceSearchModalVisibleStore } from '../hooks/stores/use-add-reference-search-modal-visible-store';
import { Plugin as SunEditorPlugin } from 'suneditor/src/plugins/Plugin';
import SunEditorPlugins from 'suneditor/src/plugins';
import { renderToString } from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon } from '@fortawesome/free-solid-svg-icons';
import { cleanStatblockData, isStatblock } from '../utils/dnd-5etools-statblock-data-cleaner';

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
    const { addReferenceSearchModalVisible, setAddReferenceSearchModalVisible } =
        useAddReferenceSearchModalVisibleStore();
    const editor = useRef<SunEditorCore>();

    useEffect(() => {
        const addReferenceModalUnsubscriber = useAddReferenceSearchModalVisibleStore.subscribe((state) => {
            if (!state.addReferenceSearchModalVisible) {
                // When the add reference search modal is closed, focus on the pointer again
                editor?.current?.core.focus();
            }
        });

        return () => {
            addReferenceModalUnsubscriber();
        };
    }, []);

    const add5etoolsStatblockPlugin = {
        // @Required @Unique
        // plugin name
        name: 'add5etoolsStatblock',
        // @Required
        // data display
        display: 'command',

        // @Options
        title: 'Agregar statblock de 5e tools',
        buttonClass: '',
        innerHTML: renderToString(<FontAwesomeIcon icon={faDragon} />),

        // @Required
        // add function - It is called only once when the plugin is first run.
        // This function generates HTML to append and register the event.
        // arguments - (core : core object, targetElement : clicked button element)
        add: (core: Core, targetElement?: any) => {
            const context = core.context;
            const addedElement = core.util.createElement('div');
            core.util.addClass(addedElement, '__5etools_statblock');
            core.util.addClass(addedElement, '__se__tag');

            // @Required
            // Registering a namespace for caching as a plugin name in the context object
            context.customCommand = {
                targetButton: targetElement,
                tag: addedElement,
            };
        },

        // @Override core
        // Plugins with active methods load immediately when the editor loads.
        // Called each time the selection is moved.
        active: (element: Element) => {
            if (!editor?.current) return;
            const util = editor.current.util;
            const core = editor.current.core;
            console.log(element);
            if (!element) {
                util.removeClass(core.context.customCommand.targetButton, 'active');
            } else if (util.hasClass(element, '__5etools_statblock')) {
                util.addClass(core.context.customCommand.targetButton, 'active');
                return true;
            }

            return false;
        },

        // @Required, @Override core
        // The behavior of the "command plugin" must be defined in the "action" method.
        action: () => {
            if (!editor?.current) return;

            const child = editor.current.core.getSelectionNode();
            if (!child) return;
            const parent = editor.current.util.getParentElement(editor.current.core.getSelectionNode(), 'div');
            if (!parent) return;

            if (editor.current.util.hasClass(parent, '__5etools_statblock')) {
                const childrenContent =
                    '<p>' + [...parent.children].map((x: any) => x.innerHTML).join('</p><p>') + '</p>';
                editor.current.util.changeElement(parent, childrenContent ?? '');
            } else {
                editor.current.core.applyRangeFormatElement(
                    editor.current.core.context.customCommand.tag.cloneNode(false)
                );
            }
        },
    } as SunEditorPlugin;

    const editorOptions = {
        plugins: [
            SunEditorPlugins.formatBlock,
            SunEditorPlugins.align,
            SunEditorPlugins.horizontalRule,
            SunEditorPlugins.list,
            SunEditorPlugins.table,
            SunEditorPlugins.link,
            SunEditorPlugins.image,
            SunEditorPlugins.video,
            SunEditorPlugins.audio,
            add5etoolsStatblockPlugin,
        ],
        buttonList: [
            ['formatBlock', 'bold', 'underline', 'italic', 'strike'],
            ['removeFormat'],
            ['align', 'horizontalRule', 'list'],
            ['table', 'link', 'image', 'video', 'audio'],
            ['add5etoolsStatblock'],
            ['codeView'],
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

    const getSunEditorInstance = (sunEditor: any) => {
        editor.current = sunEditor;
    };

    const handleInput = (event: any) => {
        setIsProcessing(true);
        if (editor && editor.current && event?.inputType === 'insertText' && event?.data === '@') {
            setAddReferenceSearchModalVisible(true);
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
        setAddReferenceSearchModalVisible(false);
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
        setAddReferenceSearchModalVisible(false);
        editor?.current?.core.focus();
    };

    const decodeEntities = (text: string) => {
        const element = document.createElement('textarea');
        element.innerHTML = text;
        return element.value;
    };

    const handlePaste = (event: ClipboardEvent, cleanData: string, maxCharCount: boolean) => {
        try {
            // Try minify JSONs
            const json = decodeEntities(cleanData).replace(/(<\/?[^>]+(>|$)|​)/g, '');
            let parsed = JSON.parse(json);

            // If it is a 5etools statblock, we remove the unused properties
            if (isStatblock(parsed)) {
                parsed = cleanStatblockData(parsed);
            }

            const minified = JSON.stringify(parsed);
            editor.current?.insertHTML(minified);
            // Returning false we prevent the paste
            return false;
        } catch (e) {}
    };

    return (
        <div className="EditorContainer">
            <SunEditor
                lang="es"
                defaultValue={initialValue}
                height={getEditorHeight()}
                onChange={(state: string) => handleChange(state)}
                onInput={(event) => handleInput(event)}
                onPaste={(event, cleanData, maxCharCount) => handlePaste(event, cleanData, maxCharCount)}
                getSunEditorInstance={getSunEditorInstance}
                setOptions={editorOptions}
            />
            {addReferenceSearchModalVisible ? (
                <AddReferenceSearchModal
                    appContext={appContext}
                    onSubmit={onReferenceAdded}
                    onCancel={onReferenceModalCancel}
                />
            ) : null}
        </div>
    );
};
