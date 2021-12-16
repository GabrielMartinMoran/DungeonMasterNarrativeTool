import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParagraphElementComponent } from '../ParagraphElementComponent';
import '../../styles/ViewElement.css';
import { ShopElementComponent } from '../ShopElementComponent';

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
                .getNarrativeCategory(narrativeCategoryId).getElement(elementId);
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
                    <div className='flex1 textRight viewElementTitleButtons'>
                        <button onClick={editName}>
                            <span role='img' aria-label='tag'>🏷️</span>
                            Editar nombre
                        </button>
                        <button onClick={editBody}>
                            <span role='img' aria-label='edit'>📝</span>
                            Editar
                        </button>
                        <button onClick={copyRelativeLink}>
                            <span role='img' aria-label='link'>🔗</span>
                            Copiar enlace
                        </button>
                        <button onClick={deleteElement}>
                            <span role='img' aria-label='delete'>🗑️</span>
                            Eliminar
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