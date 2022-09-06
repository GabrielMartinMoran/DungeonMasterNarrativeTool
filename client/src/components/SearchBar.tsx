import '../styles/SearchBar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../app-context';
import { BaseElement } from '../models/base-element';
import { NarrativeContext } from '../models/narrative-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

let _searchResults: any[] = [];
let _resultIndex = -1;

export type SearchBarProps = {
    appContext: AppContext;
};

export const SearchBar: React.FC<SearchBarProps> = ({ appContext }) => {
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState<BaseElement[]>([]);
    const [resultIndex, setResultIndex] = useState(-1);
    const [narrativeContext, setNarrativeContext] = useState<NarrativeContext | null>(null);

    const moveIndexUp = () => {
        if (_searchResults.length === 0) {
            _resultIndex = -1;
            setResultIndex(_resultIndex);
            return;
        }
        _resultIndex--;
        if (_resultIndex < 0) {
            _resultIndex = 0;
        }
        setResultIndex(_resultIndex);
    };

    const moveIndexDown = () => {
        if (_searchResults.length === 0) {
            _resultIndex = -1;
            setResultIndex(_resultIndex);
            return;
        }
        _resultIndex++;
        if (_resultIndex > _searchResults.length - 1) {
            _resultIndex = _searchResults.length - 1;
        }
        setResultIndex(_resultIndex);
    };

    const generateElementLink = (element: BaseElement): string => {
        if (!narrativeContext) return '';
        const narrativeCategory = narrativeContext.getNarrativeCategoryByElementId(element.id);
        return `/narrative-context/${appContext.getNarrativeContextId()}/${narrativeCategory!.id}/${element.id}`;
    };

    const navigateToElement = () => {
        if (_resultIndex === -1) return;
        navigate(generateElementLink(_searchResults[_resultIndex]));
        appContext.hideSearchBar();
    };

    const moveIndex = (event: any) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveIndexUp();
            scrollToSeletedResult();
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveIndexDown();
            scrollToSeletedResult();
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            navigateToElement();
            return;
        }
    };

    const scrollToSeletedResult = () => {
        const element = document.getElementById(`searchResult_${_resultIndex}`);
        if (element) {
            element.scrollIntoView(true);
        }
    };

    useEffect(() => {
        const init = async () => {
            setNarrativeContext(
                await appContext.repositories.narrativeContext.get(appContext.getNarrativeContextId()!)
            );
            // Anything in here is fired on component mount.
            document.addEventListener('keydown', moveIndex);
            search('');
        };
        init();
        return () => {
            // Anything in here is fired on component unmount.
            document.removeEventListener('keydown', moveIndex);
        };
    }, [narrativeContext]);

    const search = (term: string) => {
        if (narrativeContext) {
            const elements = narrativeContext.searchTerm(term);
            _searchResults = elements;
            _resultIndex = elements.length > 0 ? 0 : -1;
        } else {
            _searchResults = [];
            _resultIndex = -1;
        }
        setSearchResults(_searchResults);
        setResultIndex(_resultIndex);
    };

    return (
        <div className="SearchBar">
            <div className="searchBarInputContainer">
                <input
                    autoFocus
                    key="searchBarTextInput"
                    onChange={(event) => search(event.target.value)}
                    placeholder="Ingrese el término a buscar"
                    className="searchBarInput"
                />
                <button onClick={appContext.hideSearchBar}>
                    <FontAwesomeIcon icon={faXmark} /> Cerrar
                </button>
            </div>
            <div className="searchResultsContainer">
                {searchResults.map((element: BaseElement, i: number) => (
                    <div
                        className={i === resultIndex ? 'searchResult searchResultSelected' : 'searchResult'}
                        id={`searchResult_${i}`}
                        key={`searchResult_${i}`}
                    >
                        <Link to={generateElementLink(element)} onClick={() => appContext.hideSearchBar()}>
                            {element.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
