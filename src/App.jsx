import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    //Link
} from 'react-router-dom';
import { AppContext } from './app-context';
import { Home } from './components/views/Home';
import { CreateNarrativeContext } from './components/views/CreateNarrativeContext';
import { ViewNarrativeContext } from './components/views/ViewNarrativeContext';
import { ViewElement } from './components/views/ViewElement';
import './styles.css';
import { Navbar } from './components/Navbar';
import './styles/App.css';
import { DataCorruptionPreventer } from './services/data-corruption-preventer';

export function App() {

    const appContext = new AppContext();

    const dataCorruptionPreventer = new DataCorruptionPreventer(appContext);
    dataCorruptionPreventer.start();

    return <div className='App'>
        <Router>
            <Navbar appContext={appContext} />
            <div className='RouterContainer'>
                <Routes>
                    <Route path='/element' element={'Article'} />
                    <Route path='/create-narrative-context' element={<CreateNarrativeContext appContext={appContext} />} />
                    <Route path='/narrative-context/:narrativeContextId/:narrativeCategoryId/:elementId' element={<ViewElement appContext={appContext} />} />
                    <Route path='/narrative-context/:narrativeContextId' element={<ViewNarrativeContext appContext={appContext} />} />
                    <Route path='/' element={<Home appContext={appContext} />} />
                </Routes>
            </div>
        </Router>
    </div>;
}