import '../../styles/search/SearchModal.css';
import { AppContext } from '../../app-context';
import { BaseElement } from '../../models/base-element';
import { useEffect, useState } from 'react';
import { NarrativeContext } from '../../models/narrative-context';
import { SearchBar } from './SearchBar';
import { AddReferenceSearchModalResult } from '../../types/add-reference-search-modal-result';
import { NarrativeContextRepository } from '../../repositories/narrative-context-repository';
import { useRepository } from '../../hooks/use-repository';
import { useNarrativeContext } from '../../hooks/use-narrative-context';

export type AddReferenceSearchModalProps = {
    appContext: AppContext;
    onSubmit: (result: AddReferenceSearchModalResult) => void;
    onCancel: () => void;
};

export const AddReferenceSearchModal: React.FC<AddReferenceSearchModalProps> = ({ appContext, onSubmit, onCancel }) => {
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);
    const narrativeContextRepository = useRepository(NarrativeContextRepository);
    const { getNarrativeContextId } = useNarrativeContext();

    useEffect(() => {
        const init = async () => {
            setNarrativeContext(await narrativeContextRepository.get(getNarrativeContextId()!));
        };
        init();
    }, [narrativeContext]);

    const generateElementLink = (element: BaseElement): string => {
        if (!narrativeContext) return '';
        const narrativeCategory = narrativeContext.getNarrativeCategoryByElementId(element.id);
        return `/narrative-context/${getNarrativeContextId()}/${narrativeCategory!.id}/${element.id}`;
    };

    const addElementReference = (element: BaseElement) => {
        const link = generateElementLink(element);
        appContext.hideSearchBar();
        onSubmit({
            name: element.name,
            link: link,
        } as AddReferenceSearchModalResult);
    };

    const listItemRenderer = (element: BaseElement) => {
        return <>{element.name}</>;
    };

    if (!narrativeContext) return null;

    return (
        <div className="SearchModal">
            <SearchBar
                narrativeContext={narrativeContext}
                onSubmit={addElementReference}
                onCancel={() => onCancel()}
                listItemRenderer={listItemRenderer}
            ></SearchBar>
        </div>
    );
};
