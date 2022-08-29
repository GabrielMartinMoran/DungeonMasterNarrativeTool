import '../styles/CreateElementButton.css';
import React, { useRef } from 'react';
import { BaseElement } from '../models/base-element';
import { CreateIcon } from './icons/CreateIcon';
import { ScrollIcon } from './icons/ScrollIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ShopIcon } from './icons/ShopIcon';

export function CreateElementButton({ onClick = (type) => {} }) {
    const dropdownBody = useRef();

    const showDropdown = () => {
        dropdownBody.current.classList.toggle('showDropdownBody');
    };

    const onDropdownElementClick = (type) => {
        dropdownBody.current.classList.toggle('showDropdownBody');
        onClick(type);
    };

    return (
        <div className="CreateElementButton">
            <button onClick={showDropdown}>
                <CreateIcon />
                <span className="tooltip">Crear elemento</span>
            </button>
            <div ref={dropdownBody} className="dropdownBody">
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.PARAGRAPH)}>
                    <ScrollIcon /> Texto
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.CONTAINER)}>
                    <FolderIcon /> Contenedor
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.SHOP)}>
                    <ShopIcon /> Tienda
                </button>
            </div>
        </div>
    );
}
