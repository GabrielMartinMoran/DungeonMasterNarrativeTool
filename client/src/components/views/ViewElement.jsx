import '../../styles/ViewElement.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParagraphElementComponent } from '../ParagraphElementComponent';
import { ShopElementComponent } from '../ShopElementComponent';
import { RenameIcon } from '../icons/RenameIcon';
import { EditIcon } from '../icons/EditIcon';
import { CopyLinkIcon } from '../icons/CopyLinkIcon';

export function ViewElement({ appContext }) {
    const navigate = useNavigate();
    const { narrativeContextId, narrativeCategoryId, elementId } = useParams();
    const [element, setElement] = useState(null);
    const childFuntions = {};

    useEffect(() => {
        const setNavigationButtons = () => {
            const narrativeCategory = appContext
                .getDB()
                .getNarrativeContext(narrativeContextId)
                .getNarrativeCategory(narrativeCategoryId);
            const prevElement = narrativeCategory.getPrevElement(elementId, narrativeContextId);
            const nextElement = narrativeCategory.getNextElement(elementId, narrativeContextId);
            if (prevElement) {
                appContext.setBackButtonUrl(
                    `/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${prevElement.id}`
                );
            } else {
                appContext.setBackButtonUrl(`/narrative-context/${narrativeContextId}`);
            }
            if (nextElement) {
                appContext.setForwardButtonUrl(
                    `/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${nextElement.id}`
                );
            } else {
                appContext.setForwardButtonUrl(null);
            }
        };

        const init = async () => {
            appContext.setNarrativeContextById(narrativeContextId);

            let obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            if (!obtainedNarrativeContext || obtainedNarrativeContext.isOnlyReference()) {
                await appContext.pullNarrativeContext(narrativeContextId);
                obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            }

            const obtainedElement = obtainedNarrativeContext
                .getNarrativeCategory(narrativeCategoryId)
                .findElementAnywhere(elementId);
            setElement(obtainedElement);

            setNavigationButtons();
        };
        init();
    }, [appContext, narrativeContextId, narrativeCategoryId, elementId]);

    const copyRelativeLink = () => {
        const relLink = `${window.location.origin}/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${elementId}`;
        navigator.clipboard.writeText(relLink);
    };

    const editName = () => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element.name);
        if (name) {
            const narrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            const obtainedElement = narrativeContext
                .getNarrativeCategory(narrativeCategoryId)
                .findElementAnywhere(elementId);
            obtainedElement.name = name;
            appContext.saveNarrativeContext(narrativeContext);
            setElement({ ...obtainedElement });
            setTimeout(() => {
                setElement(obtainedElement);
            }, 0);
        }
    };

    const editBody = () => {
        childFuntions.edit();
    };

    const deleteElement = () => {
        const shouldDelete = window.confirm(`Estas seguro de eliminar el elemento ${element.name}`);
        if (!shouldDelete) return;
        const narrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
        const narrativeCategory = narrativeContext.getNarrativeCategory(narrativeCategoryId);
        narrativeCategory.removeElement(element.id);
        appContext.saveNarrativeContext(narrativeContext);
        navigate(`/narrative-context/${narrativeContextId}`);
    };

    return (
        <div className="ViewElement">
            {element ? (
                <>
                    <div className="flex viewElementTitleBar">
                        <h2 className="flex2">{element.name}</h2>
                        <div className="textRight viewElementTitleButtons">
                            <button onClick={editName}>
                                <RenameIcon />
                                <span className="tooltip">Renombrar</span>
                            </button>
                            <button onClick={editBody}>
                                <EditIcon />
                                <span className="tooltip">Editar</span>
                            </button>
                            <button onClick={copyRelativeLink}>
                                <CopyLinkIcon />
                                <span className="tooltip">Copiar enlace</span>
                            </button>
                            {/*
                            <button onClick={deleteElement}>
                                <DeleteIcon />
                                <span className='tooltip'>Eliminar</span>
                            </button>
                            */}
                        </div>
                    </div>
                    {
                        {
                            paragraph: (
                                <ParagraphElementComponent
                                    key={element.id}
                                    appContext={appContext}
                                    element={element}
                                    parentExposedFuntions={childFuntions}
                                    narrativeContextId={narrativeContextId}
                                />
                            ),
                            shop: (
                                <ShopElementComponent
                                    key={element.id}
                                    appContext={appContext}
                                    element={element}
                                    parentExposedFuntions={childFuntions}
                                    narrativeContextId={narrativeContextId}
                                />
                            ),
                        }[element.type]
                    }
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
