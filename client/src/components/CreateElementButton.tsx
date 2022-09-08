import '../styles/CreateElementButton.css';
import React, { useEffect, useRef } from 'react';
import { BaseElement } from '../models/base-element';
import { CreateIcon } from './icons/CreateIcon';
import { ElmentIconsMapper } from '../utils/element-icons-mapper';

export type CreateElementButtonProps = {
    onClick: (type: string) => void;
};

export const CreateElementButton: React.FC<CreateElementButtonProps> = ({ onClick = (type) => {} }) => {
    const dropdownBody: any = useRef();

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            // If the user clicked outside of the menu but not in the icon for closing it
            if (!menuRef || !menuRef.current || !(menuRef.current as any).contains(event.target)) {
                dropdownBody.current.classList.remove('showDropdownBody');
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const showDropdown = () => {
        dropdownBody.current.classList.toggle('showDropdownBody');
    };

    const onDropdownElementClick = (type: string) => {
        dropdownBody.current.classList.remove('showDropdownBody');
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
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.PARAGRAPH)} Texto
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.CONTAINER)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.CONTAINER)} Contenedor
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.LOCATION)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.LOCATION)} Lugar
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.SHOP)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.SHOP)} Tienda
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.NPC)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.NPC)} NPC
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.CREATURE)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.CREATURE)} Criatura
                </button>
                <button onClick={() => onDropdownElementClick(BaseElement.TYPES.ITEM)}>
                    {ElmentIconsMapper.getIcon(BaseElement.TYPES.ITEM)} Objeto
                </button>
            </div>
        </div>
    );
};
