import '../../styles/ViewElement.css';
import React, { LegacyRef, Ref, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useRepository } from '../../hooks/use-repository';
import { NarrativeContextRepository } from '../../repositories/narrative-context-repository';
import { useNarrativeContext } from '../../hooks/use-narrative-context';
import { useNavigationButtonsURLStore } from '../../hooks/stores/use-navigation-buttons-url-store';

export type ViewElementProps = {
    appContext: AppContext;
};

export const ViewElement: React.FC<ViewElementProps> = ({ appContext }) => {
    const navigate = useNavigate();
    const { narrativeContextId, narrativeCategoryId, elementId } = useParams();
    const [element, setElement] = useState<BaseElement | null>(null);
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);
    const childFuntions: any = {};
    const ref = useRef<HTMLDivElement | null>(null);
    const { setNarrativeContextById } = useNarrativeContext();
    const { setBackButtonURL, setForwardButtonURL } = useNavigationButtonsURLStore();

    useEffect(() => {
        const setNavigationButtons = async () => {
            const _narrativeContext = await narrativeContextRepository.get(narrativeContextId!);
            setNarrativeContext(_narrativeContext);
            const narrativeCategory = _narrativeContext.getNarrativeCategory(narrativeCategoryId!);
            const prevElement = narrativeCategory.getPrevElement(elementId!);
            const nextElement = narrativeCategory.getNextElement(elementId!);
            if (prevElement) {
                setBackButtonURL(`/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${prevElement.id}`);
            } else {
                setBackButtonURL(`/narrative-context/${narrativeContextId}`);
            }
            if (nextElement) {
                setForwardButtonURL(
                    `/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${nextElement.id}`
                );
            } else {
                setForwardButtonURL(null);
            }
        };

        const init = async () => {
            await setNarrativeContextById(narrativeContextId!);

            const obtainedNarrativeContext = await narrativeContextRepository.get(narrativeContextId!);

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

    useEffect(() => {
        const anchorClickListener = (e: any) => {
            if (!e?.target) return;
            const url = e.target.getAttribute('href');
            // If it starts with '/' we consider it a local url so we use the internal router
            if (url.startsWith('/')) {
                e.preventDefault();
                navigate(url);
            } else if (url.startsWith(window.location.origin)) {
                // Remove origin for full links but to the same origin
                e.preventDefault();
                const updatedURL = url.replace(window.location.origin, '');
                navigate(updatedURL);
            }
        };

        // We wait until the component is rendered
        setTimeout(() => {
            // Handle all a redirects that start with "/" (because by default anchors don't work
            // well withreact-router-dom and forces a page refresh)
            ref.current?.querySelectorAll('a').forEach((node: Element) => {
                node.addEventListener('click', anchorClickListener);
                //console.log(node);
            });
        }, 0);

        return () => {
            ref.current?.querySelectorAll('a').forEach((node: Element) => {
                node.removeEventListener('click', anchorClickListener);
            });
        };
    }, [element]);

    const copyRelativeLink = () => {
        const relLink = `${window.location.origin}/narrative-context/${narrativeContextId}/${narrativeCategoryId}/${elementId}`;
        navigator.clipboard.writeText(relLink);
    };

    const editName = async () => {
        const name = window.prompt('Ingresa el nuevo nombre del elemento', element!.name);
        if (name) {
            const narrativeContext = await narrativeContextRepository.get(narrativeContextId!);
            const obtainedElement = narrativeContext
                .getNarrativeCategory(narrativeCategoryId!)
                .findElementAnywhere(elementId!)!;
            obtainedElement.name = name;
            await narrativeContextRepository.save(narrativeContext!);
            setElement(null);
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
        <div ref={ref} className="ViewElement">
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
