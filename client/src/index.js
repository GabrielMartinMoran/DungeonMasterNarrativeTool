import './index.css';
import React from 'react';
import ReactDom from 'react-dom';
import { App } from './App';
import { AppContext } from './app-context';
import { DataCorruptionPreventer } from './services/data-corruption-preventer';
import { DBRepository } from './repositories/db-repository';
import { AuthRepository } from './repositories/auth-repository';
import { KeyboardShortcutsHandler } from 'utils/keyboard-shorcuts-handler';

const appContext = new AppContext();
const dataCorruptionPreventer = new DataCorruptionPreventer(appContext);
const keyboardShortcutsHandler = new KeyboardShortcutsHandler(appContext);
const dbRepo = appContext.getRepository(DBRepository);
const authRepo = appContext.getRepository(AuthRepository);

const renderApp = () => {
    ReactDom.render(<App appContext={appContext} />, document.getElementById('root'));
};

// Just download the remote DB if use is logged in
const start = async () => {
    try {
        if (authRepo.isAuthenticated()) {
            await dbRepo.tryGetCloudDB();
        }
        dataCorruptionPreventer.start();
        keyboardShortcutsHandler.registerKeyboardShortcuts();
        renderApp();
    } catch {
        alert('Ha ocurrido un error al sincronizar con el servidor, por favor refresca la página!');
    }
};

authRepo.onLogin = () => {
    window.location = '/';
};

authRepo.onLogout = () => {
    window.location = '/login';
};

start();
