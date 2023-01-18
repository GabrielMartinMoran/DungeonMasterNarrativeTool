import '../../styles/ViewElement.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParagraphElementComponent } from '../ParagraphElementComponent';
import { ShopElementComponent } from '../ShopElementComponent';
import { RenameIcon } from '../icons/RenameIcon';
import { EditIcon } from '../icons/EditIcon';
import { CopyLinkIcon } from '../icons/CopyLinkIcon';
import { AppContext } from '../../app-context';
import { BaseElement } from '../../models/base-element';
import { ShopElement } from '../../models/shop-element';
import { ParagraphElement } from '../../models/paragraph-element';
import { NarrativeContext } from '../../models/narrative-context';
import { ElmentIconsMapper } from '../../utils/element-icons-mapper';

export type ViewElementProps = {
    appContext: AppContext;
};

export const ViewElement: React.FC<ViewElementProps> = ({ appContext }) => {
    const navigate = useNavigate();
    const { narrativeContextId, narrativeCategoryId, elementId } = useParams();
    const [element, setElement] = useState<BaseElement | null>(null);
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const childFuntions: any = {};

    useEffect(() => {
        const setNavigationButtons = async () => {
            const _narrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);
            setNarrativeContext(_narrativeContext);
            const narrativeCategory = _narrativeContext.getNarrativeCategory(narrativeCategoryId!);
            const prevElement = narrativeCategory.getPrevElement(elementId!);
            const nextElement = narrativeCategory.getNextElement(elementId!);
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
            await appContext.setNarrativeContextById(narrativeContextId!);

            const obtainedNarrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);

            const obtainedElement = obtainedNarrativeContext
                .getNarrativeCategory(narrativeCategoryId!)
                .findElementAnywhere(elementId!);
            setElement(obtainedElement);

            await setNavigationButtons();
        };
        init();
    }, [
        // narrativeContextId, narrativeCategoryId, elementId are included for reloading after navigating with ctrl+p
        narrativeContextId,
        narrativeCategoryId,
        elementId,
    ]);

    const copyRelativeLink = () => {
        const relLink = `${window.location.origin}/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${elementId}`;
        navigator.clipboard.writeText(relLink);
    };

    const editName = async () => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element!.name);
        if (name) {
            const narrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);
            const obtainedElement = narrativeContext
                .getNarrativeCategory(narrativeCategoryId!)
                .findElementAnywhere(elementId!);
            obtainedElement.name = name;
            await appContext.repositories.narrativeContext.save(narrativeContext!);
            setElement({ ...obtainedElement });
            setTimeout(() => {
                setElement(obtainedElement);
            }, 0);
        }
    };

    const editBody = () => {
        childFuntions.edit();
    };

    const renderElement = (element: BaseElement) => {
        if (element.type === BaseElement.TYPES.SHOP) {
            return (
                <ShopElementComponent
                    key={element.id}
                    appContext={appContext}
                    element={element as ShopElement}
                    parentExposedFunctions={childFuntions}
                    narrativeContextId={narrativeContextId!}
                />
            );
        }
        return (
            <ParagraphElementComponent
                key={element.id}
                appContext={appContext}
                element={element as ParagraphElement}
                parentExposedFunctions={childFuntions}
                narrativeContextId={narrativeContextId!}
            />
        );
    };

    return (
        <div className="ViewElement">
            {element ? (
                <>
                    <div className="flex viewElementTitleBar">
                        <h2 className="flex2">
                            {ElmentIconsMapper.getIconFromElement(element)} {element.name}
                        </h2>
                        <div className="textRight viewElementTitleButtons">
                            {narrativeContext?.isEditable ? (
                                <>
                                    <button onClick={editName}>
                                        <RenameIcon />
                                        <span className="tooltip">Renombrar</span>
                                    </button>
                                    <button onClick={editBody}>
                                        <EditIcon />
                                        <span className="tooltip">Editar</span>
                                    </button>
                                </>
                            ) : null}
                            <button onClick={copyRelativeLink}>
                                <CopyLinkIcon />
                                <span className="tooltip">Copiar enlace</span>
                            </button>
                        </div>
                    </div>
                    {renderElement(element)}
                </>
            ) : (
                <></>
            )}
        </div>
    );
};
