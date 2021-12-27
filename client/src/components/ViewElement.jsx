import '../styles/ViewElement.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParagraphElementComponent } from './ParagraphElementComponent';
import { ShopElementComponent } from './ShopElementComponent';
import { RenameIcon } from './icons/RenameIcon';
import { EditIcon } from './icons/EditIcon';
import { CopyLinkIcon } from './icons/CopyLinkIcon';
import { DeleteIcon } from './icons/DeleteIcon';

export function ViewElement({ appContext }) {
    const navigate = useNavigate();
    const { narrativeContextId, narrativeCategoryId, elementId } = useParams();
    const [element, setElement] = useState(null);
    const childFuntions = {};

    useEffect(() => {
        const setNavigationButtons = () => {
            const narrativeCategory = appContext.getDB().getNarrativeContext(narrativeContextId)
                .getNarrativeCategory(narrativeCategoryId);
            const prevElement = narrativeCategory.getPrevElement(elementId, narrativeContextId);
            const nextElement = narrativeCategory.getNextElement(elementId, narrativeContextId);
            if (prevElement) {
                appContext.setBackButtonUrl(`/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${prevElement.id}`);
            } else {
                appContext.setBackButtonUrl(`/narrative-context/${narrativeContextId}`);
            }
            if (nextElement) {
                appContext.setForwardButtonUrl(`/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${nextElement.id}`);
            } else {
                appContext.setForwardButtonUrl(null);
            }
        }
        appContext.setNarrativeContextById(narrativeContextId);

        const obtainedElement = appContext.getDB().getNarrativeContext(narrativeContextId)
            .getNarrativeCategory(narrativeCategoryId).findElementAnywhere(elementId);
        setElement(obtainedElement);

        setNavigationButtons();
    }, [appContext, narrativeContextId, narrativeCategoryId, elementId]);


    const copyRelativeLink = () => {
        const relLink = `${window.location.origin}/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${elementId}`;
        navigator.clipboard.writeText(relLink);
    }

    const editName = () => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (name) {
            const obtainedElement = appContext.getDB().getNarrativeContext(narrativeContextId)
                .getNarrativeCategory(narrativeCategoryId).findElementAnywhere(elementId);
            obtainedElement.name = name;
            appContext.saveDB();
            setElement({ ...obtainedElement });
            setTimeout(() => {
                setElement(obtainedElement);
            }, 0);
        }
    }

    const editBody = () => {
        childFuntions.edit();
    }

    const deleteElement = () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        const narrativeCategory = appContext.getDB().getNarrativeContext(narrativeContextId)
            .getNarrativeCategory(narrativeCategoryId);
        narrativeCategory.removeElement(element.id);
        appContext.saveDB();
        navigate(`/narrative-context/${narrativeContextId}`);
    }

    return <div className="ViewElement">
        {
            element ? <>
                <div className='flex viewElementTitleBar'>
                    <h2 className='flex2'>{element.name}</h2>
                    <div className='textRight viewElementTitleButtons'>
                        <button onClick={editName}>
                            <RenameIcon />
                            <span className='tooltip'>Renombrar</span>
                        </button>
                        <button onClick={editBody}>
                            <EditIcon />
                            <span className='tooltip'>Editar</span>
                        </button>
                        <button onClick={copyRelativeLink}>
                            <CopyLinkIcon />
                            <span className='tooltip'>Copiar enlace</span>
                        </button>
                        <button onClick={deleteElement}>
                            <DeleteIcon />
                            <span className='tooltip'>Eliminar</span>
                        </button>
                    </div>
                </div>
                {
                    {
                        'paragraph': <ParagraphElementComponent key={element.id}
                            appContext={appContext} element={element} onDelete={deleteElement} parentExposedFuntions={childFuntions}
                        />,
                        'shop': <ShopElementComponent key={element.id}
                            appContext={appContext} element={element} onDelete={deleteElement} parentExposedFuntions={childFuntions}
                        />,
                    }[element.type]
                }

            </> : <></>
        }

    </div>;
}