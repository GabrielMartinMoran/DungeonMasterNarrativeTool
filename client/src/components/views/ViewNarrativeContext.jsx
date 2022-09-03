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
import { ShareIcon } from 'components/icons/ShareIcon';
import { ShareModal } from 'components/ShareModal';

export function ViewNarrativeContext({ appContext }) {
    const navigate = useNavigate();
    const { narrativeContextId } = useParams();
    const [narrativeContext, setNarrativeContext] = useState(null);
    const [narrativeContextCategories, setNarrativeContextCategories] = useState([]);
    const [shareModalVisible, setShareModalVisible] = useState(false);

    useEffect(() => {
        const init = async () => {
            appContext.setNarrativeContextById(narrativeContextId);
            let obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            // If it was not obatined from the user narrative contexts, search on the shared ones
            if (!obtainedNarrativeContext)
                obtainedNarrativeContext = appContext.getDB().getSharedNarrativeContext(narrativeContextId);
            if (!obtainedNarrativeContext || obtainedNarrativeContext.isOnlyReference()) {
                await appContext.pullNarrativeContext(narrativeContextId);
                obtainedNarrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
                if (!obtainedNarrativeContext)
                    obtainedNarrativeContext = appContext.getDB().getSharedNarrativeContext(narrativeContextId);
            }
            setNarrativeContext(obtainedNarrativeContext);
            setNarrativeContextCategories(obtainedNarrativeContext.narrativeCategories);
            appContext.setBackButtonUrl('/');
            appContext.setForwardButtonUrl(null);
        };

        init();
    }, []);

    const addNarrativeCategory = () => {
        const categoryName = window.prompt('Ingresa nombre de la categoría');
        if (categoryName) {
            const category = new NarrativeCategory(categoryName);
            const narrativeContext = appContext.getDB().getNarrativeContext(narrativeContextId);
            narrativeContext.addNarrativeCategory(category);
            //appContext.saveDB();
            appContext.saveNarrativeContext(narrativeContext);
            setNarrativeContextCategories([...narrativeContext.narrativeCategories]);
        }
    };

    const deleteNarrativeContext = async () => {
        const shouldDelete = window.confirm(
            `Estas seguro que deseas eliminar ${narrativeContext.type === 'world' ? 'el mundo' : 'la campaña'} ${
                narrativeContext.name
            }`
        );
        if (!shouldDelete) return;
        //appContext.saveDB();
        await appContext.deleteNarrativeContext(narrativeContextId);
        appContext.getDB().removeNarrativeContext(narrativeContextId);
        navigate('/');
    };

    const renameMarrativeContext = () => {
        const name = window.prompt(
            `Ingresa el nuevo nombre de ${narrativeContext.type === 'world' ? 'el mundo' : 'la campaña'}`,
            narrativeContext.name
        );
        if (!name) return;
        narrativeContext.name = name;
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        setNarrativeContext({ ...narrativeContext });
        appContext.setNarrativeContextById(null);
        setTimeout(() => {
            setNarrativeContext(narrativeContext);
            appContext.setNarrativeContextById(narrativeContextId);
        }, 0);
    };

    const onCategoryChange = () => {
        setNarrativeContextCategories([...narrativeContext.narrativeCategories]);
    };

    const moveCategoryUp = (category) => {
        narrativeContext.moveNarrativeCategoryUp(category.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        setNarrativeContextCategories([...narrativeContext.narrativeCategories]);
    };

    const moveCategoryDown = (category) => {
        narrativeContext.moveNarrativeCategoryDown(category.id);
        //appContext.saveDB();
        appContext.saveNarrativeContext(narrativeContext);
        setNarrativeContextCategories([...narrativeContext.narrativeCategories]);
    };

    const exportNarrativeContext = () => {
        const narrativeContextDownloadLink = document.getElementById('narrativeContextDownloadLink');
        const content = JSON.stringify(narrativeContext.toJson(), null, 2);
        const file = new Blob([content], { type: 'application/json' });
        narrativeContextDownloadLink.href = URL.createObjectURL(file);
        narrativeContextDownloadLink.download = `${
            NarrativeContext.TYPES.find((x) => x.type === narrativeContext.type).name
        } - ${narrativeContext.name}.json`;
        narrativeContextDownloadLink.click();
    };

    const closeShareModal = () => {
        setShareModalVisible(false);
    };

    return (
        <>
            {shareModalVisible ? (
                <ShareModal appContext={appContext} narrativeContext={narrativeContext} onClosed={closeShareModal} />
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
                        <button onClick={addNarrativeCategory}>
                            <CreateIcon />
                            <span className="tooltip">Crear categoría</span>
                        </button>
                        <button onClick={renameMarrativeContext}>
                            <RenameIcon />
                            <span className="tooltip">Renombrar</span>
                        </button>
                        <a hidden={true} id="narrativeContextDownloadLink" href="/">
                            {' '}
                        </a>
                        <button onClick={exportNarrativeContext}>
                            <ExportNarrativeContextIcon />
                            <span className="tooltip">Exportar</span>
                        </button>
                        <button onClick={() => setShareModalVisible(true)}>
                            <ShareIcon />
                            <span className="tooltip">Compartir</span>
                        </button>
                        <button onClick={deleteNarrativeContext}>
                            <DeleteIcon />
                            <span className="tooltip">Eliminar</span>
                        </button>
                    </div>
                </div>
                {narrativeContextCategories.map((category) => (
                    <NarrativeCategoryComponent
                        key={category.id}
                        appContext={appContext}
                        narrativeCategory={category}
                        narrativeContext={narrativeContext}
                        onCategoryChange={onCategoryChange}
                        moveCategoryUp={moveCategoryUp}
                        moveCategoryDown={moveCategoryDown}
                    />
                ))}
            </div>
        </>
    );
}
