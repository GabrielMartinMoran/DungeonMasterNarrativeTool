import '../../styles/search/SearchModal.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../app-context';
import { BaseElement } from '../../models/base-element';
import { useEffect, useState } from 'react';
import { NarrativeContext } from '../../models/narrative-context';
import { SearchBar } from './SearchBar';
import { useRepository } from '../../hooks/use-repository';
import { NarrativeContextRepository } from '../../repositories/narrative-context-repository';
import { useNarrativeContext } from '../../hooks/use-narrative-context';

export type NavigationSearchModalProps = {
    appContext: AppContext;
};

export const NavigationSearchModal: React.FC<NavigationSearchModalProps> = ({ appContext }) => {
    const navigate = useNavigate();
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

    const navigateToElement = (element: BaseElement) => {
        navigate(generateElementLink(element));
        appContext.hideSearchBar();
    };

    const onCancel = () => {
        appContext.hideSearchBar();
    };

    const listItemRenderer = (element: BaseElement) => {
        return (
            <Link to={generateElementLink(element)} onClick={() => appContext.hideSearchBar()}>
                {element.name}
            </Link>
        );
    };

    if (!narrativeContext) return null;

    return (
        <div className="SearchModal">
            <SearchBar
                narrativeContext={narrativeContext}
                onSubmit={navigateToElement}
                onCancel={onCancel}
                listItemRenderer={listItemRenderer}
            ></SearchBar>
        </div>
    );
};
