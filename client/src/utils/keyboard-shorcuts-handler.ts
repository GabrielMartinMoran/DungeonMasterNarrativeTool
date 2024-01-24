import { AppContext } from '../app-context';

export class KeyboardShortcutsHandler {
    protected _pressedKeys: string[] = [];
    protected _appContext: AppContext;

    constructor(appContext: AppContext) {
        this._appContext = appContext;
    }

    _addPressedKey(key: string) {
        if (!this._pressedKeys.find((x) => x === key)) {
            this._pressedKeys.push(key);
        }
    }

    _tryRemovePressedKey = (key: string) => {
        const index = this._pressedKeys.indexOf(key);
        if (index !== -1) {
            this._pressedKeys.splice(index, 1);
        }
    };

    _keyPressed(key: string) {
        return this._pressedKeys.indexOf(key) !== -1;
    }

    registerKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            this._addPressedKey(event.key);

            // Prevent default ctrl + p
            if (this._keyPressed('Control') && event.key === 'p') {
                event.preventDefault();
                this._appContext.triggerEvent('open_search');
                return;
            }

            if (event.key === 'Escape') {
                this._appContext.triggerEvent('close_search');
                this._appContext.triggerEvent('close_add_reference');
                return;
            }

            /*
            // Navigate to previous element
            if (this._keyPressed('Alt') && event.key === 'ArrowLeft') {
                event.preventDefault();
                this._appContext.navigateToPreviousElement();
                return;
            }
            
            // Navigate to next element
            if (this._keyPressed('Alt') && event.key === 'ArrowRight') {
                event.preventDefault();
                this._appContext.navigateToNextElement();
                return;
            }
            */
        });
        document.addEventListener('keyup', (event) => {
            this._tryRemovePressedKey(event.key);
        });
    }
}
