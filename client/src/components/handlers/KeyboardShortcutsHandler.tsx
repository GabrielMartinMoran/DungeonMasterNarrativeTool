import React, { useEffect } from 'react';
import { useNavigationSearchModalVisibleStore } from '../../hooks/stores/use-navigation-search-modal-visible-store';
import { useAddReferenceSearchModalVisibleStore } from '../../hooks/stores/use-add-reference-search-modal-visible-store';

export const KeyboardShortcursHandler: React.FC = () => {
    const pressedKeys: string[] = [];

    const { setNavigationSearchModalVisible } = useNavigationSearchModalVisibleStore();
    const { setAddReferenceSearchModalVisible } = useAddReferenceSearchModalVisibleStore();

    const addPressedKey = (key: string) => {
        if (!pressedKeys.find((x) => x === key)) {
            pressedKeys.push(key);
        }
    };

    const tryRemovePressedKey = (key: string) => {
        const index = pressedKeys.indexOf(key);
        if (index !== -1) {
            pressedKeys.splice(index, 1);
        }
    };

    const keyPressed = (key: string) => {
        return pressedKeys.indexOf(key) !== -1;
    };

    const listeners = {
        keydown: (event: KeyboardEvent) => {
            addPressedKey(event.key);

            // Prevent default ctrl + p
            if (keyPressed('Control') && event.key === 'p') {
                event.preventDefault();
                setNavigationSearchModalVisible(true);
                return;
            }

            if (event.key === 'Escape') {
                setNavigationSearchModalVisible(false);
                setAddReferenceSearchModalVisible(false);
                return;
            }
        },
        keyup: (event: KeyboardEvent) => {
            tryRemovePressedKey(event.key);
        },
    };

    useEffect(() => {
        document.addEventListener('keydown', listeners.keydown);
        document.addEventListener('keyup', listeners.keyup);

        return () => {
            document.removeEventListener('keydown', listeners.keydown);
            document.removeEventListener('keyup', listeners.keyup);
        };
    }, []);

    return null;
};
