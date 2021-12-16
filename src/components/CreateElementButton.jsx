import '../styles/CreateElementButton.css';
import React, { useRef, useState } from 'react';
import { BaseElement } from '../models/base-element';

export function CreateElementButton({ onClick = (type) => { } }) {

    const dropdownBody = useRef();


    const showDropdown = () => {
        dropdownBody.current.classList.toggle('showDropdownBody');
    }

    const onDropdownElementClick = (type) => {
        dropdownBody.current.classList.toggle('showDropdownBody');
        onClick(type);
    }

    return <div className="CreateElementButton">
        <button onClick={showDropdown}>
            <span role='img' aria-label='plus'>➕</span>
            Crear elemento
        </button>
        <div ref={dropdownBody} className='dropdownBody'>
            <button onClick={() => onDropdownElementClick(BaseElement.TYPES.PARAGRAPH)}>
                <span role='img' aria-label='text'>📜</span>
                Texto
            </button>
            <button onClick={() => onDropdownElementClick(BaseElement.TYPES.CONTAINER)}>
                <span role='img' aria-label='open-folder'>📂</span>
                Contenedor
            </button>
            <button onClick={() => onDropdownElementClick(BaseElement.TYPES.SHOP)}>
                <span role='img' aria-label='coin'>🪙</span>
                Tienda
            </button>
        </div>
    </div>;
}