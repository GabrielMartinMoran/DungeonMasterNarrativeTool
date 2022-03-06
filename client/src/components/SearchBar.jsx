import '../styles/SearchBar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

let _searchResults = [];
let _resultIndex = -1;


export function SearchBar({ appContext }) {

    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState([]);
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

    const generateElementLink = (element) => {
        const db = appContext.getDB();
        const narrativeContext = db.getNarrativeContext(appContext.getNarrativeContextId());
        const narrativeCategory = narrativeContext.getNarrativeCategoryByElementId(element.id);
        return `/narrative-context/${appContext.getNarrativeContextId()}/${narrativeCategory.id}/${element.id}`;
    }

    const navigateToElement = () => {
        if (_resultIndex === -1) return;
        navigate(generateElementLink(_searchResults[_resultIndex]));
        appContext.hideSearchBar();
    }

    const moveIndex = (event) => {
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
    }

    useEffect(() => {
        // Anything in here is fired on component mount.
        document.addEventListener('keydown', moveIndex);
        return () => {
            // Anything in here is fired on component unmount.
            document.removeEventListener('keydown', moveIndex);
        }
    }, [_searchResults, _resultIndex]);


    const search = (term) => {
        if (!term) {
            _searchResults = [];
            _resultIndex = -1;
            setSearchResults(_searchResults);
            setResultIndex(_resultIndex);
            return;
        }
        const db = appContext.getDB();
        const narrativeContextId = appContext.getNarrativeContextId();
        if (narrativeContextId) {
            const elements = db.searchTerm(term, narrativeContextId);
            _searchResults = elements;
            _resultIndex = elements.length > 0 ? 0 : -1;
        } else {
            _searchResults = [];
            _resultIndex = -1;
        }
        setSearchResults(_searchResults);
        setResultIndex(_resultIndex);
    }

    return <div className='SearchBar'>
        <div className='searchBarInputContainer'>
            <input autoFocus key='searchBarTextInput' onChange={(event) => search(event.target.value)}
                placeholder='Ingrese el término a buscar' className='searchBarInput' />
        </div>
        <div className='searchResultsContainer'>
            {
                searchResults.map((element, i) =>
                    <div className={i === resultIndex ? 'searchResult searchResultSelected' : 'searchResult'} id={`searchResult_${i}`} key={`searchResult_${i}`}>
                        <Link to={generateElementLink(element)} onClick={() => appContext.hideSearchBar()}>
                            {element.name}
                        </Link>
                    </div>)
            }
        </div>
    </div>;
}