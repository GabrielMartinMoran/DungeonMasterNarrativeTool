import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppContext } from './app-context';
import { DataCorruptionPreventer } from './services/data-corruption-preventer';
import { KeyboardShortcutsHandler } from './utils/keyboard-shorcuts-handler';

const appContext = new AppContext();
const dataCorruptionPreventer = new DataCorruptionPreventer(appContext);
const keyboardShortcutsHandler = new KeyboardShortcutsHandler(appContext);

const renderApp = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <App appContext={appContext} />
        </React.StrictMode>
    );
};

// Just download the remote DB if use is logged in
const start = async () => {
    try {
        dataCorruptionPreventer.start();
        keyboardShortcutsHandler.registerKeyboardShortcuts();
        renderApp();
    } catch {
        alert('Ha ocurrido un error al sincronizar con el servidor, por favor refresca la página!');
    }
};

appContext.repositories.auth.onLogin = () => {
    window.location.assign('/');
};

appContext.repositories.auth.onLogout = () => {
    window.location.assign('/login');
};

start();
