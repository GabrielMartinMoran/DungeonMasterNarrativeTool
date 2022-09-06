import '../../styles/ViewNarrativeContext.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NarrativeCategory } from '../../models/narrative-category';
import { NarrativeCategoryComponent } from '../NarrativeCategoryComponent';
import { CreateIcon } from '../icons/CreateIcon';
import { RenameIcon } from '../icons/RenameIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { ExportNarrativeContextIcon } from '../icons/ExportNarrativeContextIcon';
import { NarrativeContext } from '../../models/narrative-context';
import { AppContext } from '../../app-context';
import { ShareModal } from '../ShareModal';
import { ShareIcon } from '../icons/ShareIcon';
import { NarrativeContextFactory } from '../../factories/narrative-context-factory';

export type ViewNarrativeContextProps = {
    appContext: AppContext;
};

export const ViewNarrativeContext: React.FC<ViewNarrativeContextProps> = ({ appContext }) => {
    const navigate = useNavigate();
    const { narrativeContextId } = useParams();
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const [narrativeContextCategories, setNarrativeContextCategories] = useState<NarrativeCategory[]>([]);
    const [shareModalVisible, setShareModalVisible] = useState(false);

    useEffect(() => {
        const init = async () => {
            await appContext.setNarrativeContextById(narrativeContextId!);
            const obtainedNarrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);
            setNarrativeContext(obtainedNarrativeContext);
            setNarrativeContextCategories(obtainedNarrativeContext.narrativeCategories);
            appContext.setBackButtonUrl('/');
            appContext.setForwardButtonUrl(null);
        };

        init();
    }, []);

    const addNarrativeCategory = async () => {
        const categoryName = window.prompt('Ingresa nombre de la categoría');
        if (categoryName) {
            const category = new NarrativeCategory(categoryName);
            const narrativeContext = await appContext.repositories.narrativeContext.get(narrativeContextId!);
            narrativeContext.addNarrativeCategory(category);
            await appContext.repositories.narrativeContext.save(narrativeContext!);
            setNarrativeContextCategories([...narrativeContext.narrativeCategories]);
        }
    };

    const deleteNarrativeContext = async () => {
        const shouldDelete = window.confirm(
            `Estas seguro que deseas eliminar ${narrativeContext!.type === 'world' ? 'el mundo' : 'la campaña'} ${
                narrativeContext!.name
            }`
        );
        if (!shouldDelete) return;
        await appContext.repositories.narrativeContext.delete(narrativeContextId!);
        navigate('/');
    };

    const renameMarrativeContext = async () => {
        const name = window.prompt(
            `Ingresa el nuevo nombre de ${narrativeContext!.type === 'world' ? 'el mundo' : 'la campaña'}`,
            narrativeContext!.name
        );
        if (!name) return;
        narrativeContext!.name = name;
        await appContext.repositories.narrativeContext.save(narrativeContext!);
        setNarrativeContext(NarrativeContext.fromJson(narrativeContext!.toJson()));
        await appContext.setNarrativeContextById(null);
        setTimeout(async () => {
            setNarrativeContext(narrativeContext);
            await appContext.setNarrativeContextById(narrativeContextId!);
        }, 0);
    };

    const onCategoryChange = () => {
        setNarrativeContextCategories([...narrativeContext!.narrativeCategories]);
    };

    const moveCategoryUp = async (category: NarrativeCategory) => {
        narrativeContext!.moveNarrativeCategoryUp(category.id);
        await appContext.repositories.narrativeContext.save(narrativeContext!);
        setNarrativeContextCategories([...narrativeContext!.narrativeCategories]);
    };

    const moveCategoryDown = async (category: NarrativeCategory) => {
        narrativeContext!.moveNarrativeCategoryDown(category.id);
        await appContext.repositories.narrativeContext.save(narrativeContext!);
        setNarrativeContextCategories([...narrativeContext!.narrativeCategories]);
    };

    const exportNarrativeContext = () => {
        const narrativeContextDownloadLink: any = document.getElementById('narrativeContextDownloadLink');
        const content = JSON.stringify(narrativeContext!.toJson(), null, 2);
        const file = new Blob([content], { type: 'application/json' });
        narrativeContextDownloadLink.href = URL.createObjectURL(file);
        narrativeContextDownloadLink.download = `${
            NarrativeContext.TYPES.find((x) => x.type === narrativeContext!.type)!.name
        } - ${narrativeContext!.name}.json`;
        narrativeContextDownloadLink.click();
    };

    const closeShareModal = () => {
        setShareModalVisible(false);
    };

    return (
        <>
            {shareModalVisible ? (
                <ShareModal appContext={appContext} narrativeContext={narrativeContext!} onClosed={closeShareModal} />
            ) : null}
            <div className="ViewNarrativeContext">
                <div className="flex narrativeContextTitleBar">
                    <h1 className="flex2">
                        {narrativeContext?.type === 'world' ? (
                            <span role="img" aria-label="world">
                                🌎
                            </span>
                        ) : (
                            <span role="img" aria-label="books">
                                📚
                            </span>
                        )}{' '}
                        {narrativeContext?.name}
                    </h1>
                    <div className="textRight narrativeContextTitleButtons">
                        {narrativeContext?.isEditable ? (
                            <>
                                <button onClick={addNarrativeCategory}>
                                    <CreateIcon />
                                    <span className="tooltip">Crear categoría</span>
                                </button>
                                <button onClick={renameMarrativeContext}>
                                    <RenameIcon />
                                    <span className="tooltip">Renombrar</span>
                                </button>
                            </>
                        ) : null}
                        <a hidden={true} id="narrativeContextDownloadLink" href="/">
                            {' '}
                        </a>
                        <button onClick={exportNarrativeContext}>
                            <ExportNarrativeContextIcon />
                            <span className="tooltip">Exportar</span>
                        </button>
                        {narrativeContext?.isEditable ? (
                            <>
                                <button onClick={() => setShareModalVisible(true)}>
                                    <ShareIcon />
                                    <span className="tooltip">Compartir</span>
                                </button>

                                <button onClick={deleteNarrativeContext}>
                                    <DeleteIcon />
                                    <span className="tooltip">Eliminar</span>
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
                {narrativeContextCategories.length > 0 ? (
                    narrativeContextCategories.map((category) => (
                        <NarrativeCategoryComponent
                            key={category.id}
                            appContext={appContext}
                            narrativeCategory={category}
                            narrativeContext={narrativeContext!}
                            onCategoryChange={onCategoryChange}
                            moveCategoryUp={moveCategoryUp}
                            moveCategoryDown={moveCategoryDown}
                        />
                    ))
                ) : (
                    <div className='EmptyNarrativeContextText'>
                        {narrativeContext?.isEditable
                            ? 'Todavía no has creado ninguna categoría para este contexto narrativo...'
                            : 'Parece que este contexto narrativo esta vacío!'}
                    </div>
                )}
            </div>
        </>
    );
};
