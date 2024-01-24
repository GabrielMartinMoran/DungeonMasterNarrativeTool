import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppContext } from './app-context';
import { DataCorruptionPreventer } from './services/data-corruption-preventer';
import { getOrInstantiateRepository } from './hooks/use-repository';
import { AuthRepository } from './repositories/auth-repository';

const appContext = new AppContext();
const dataCorruptionPreventer = new DataCorruptionPreventer(appContext);

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
        renderApp();
    } catch {
        alert('Ha ocurrido un error al sincronizar con el servidor, por favor refresca la página!');
    }
};

getOrInstantiateRepository(AuthRepository).onLogin = () => {
    window.location.assign('/');
};

getOrInstantiateRepository(AuthRepository).onLogout = () => {
    window.location.assign('/login');
};

start();
