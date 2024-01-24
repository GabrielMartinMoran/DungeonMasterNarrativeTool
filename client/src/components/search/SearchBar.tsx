import '../../styles/search/SearchBar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../app-context';
import { BaseElement } from '../../models/base-element';
import { NarrativeContext } from '../../models/narrative-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ElmentIconsMapper } from '../../utils/element-icons-mapper';

let _searchResults: any[] = [];
let _resultIndex = -1;

export type SearchBarProps = {
    narrativeContext: NarrativeContext;
    onSubmit: (element: BaseElement) => void;
    onCancel: () => void;
    listItemRenderer: (element: BaseElement) => JSX.Element;
};

export const SearchBar: React.FC<SearchBarProps> = ({
    narrativeContext,
    onSubmit,
    onCancel,
    listItemRenderer = (element: BaseElement) => element.name,
}) => {
    const [searchResults, setSearchResults] = useState<BaseElement[]>([]);
    const [resultIndex, setResultIndex] = useState(-1);

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

    const onEnterKey = () => {
        if (_resultIndex === -1) return;
        onSubmit(_searchResults[_resultIndex]);
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
            onEnterKey();
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
            document.addEventListener('keydown', moveIndex);
            search('');
        };
        init();
        return () => {
            document.removeEventListener('keydown', moveIndex);
        };
    }, []);

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
                <button onClick={() => onCancel()}>
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
                        <span className="searchResultsElementIcon">
                            {ElmentIconsMapper.getIconFromElement(element)}
                        </span>
                        {listItemRenderer(element)}
                    </div>
                ))}
            </div>
        </div>
    );
};
