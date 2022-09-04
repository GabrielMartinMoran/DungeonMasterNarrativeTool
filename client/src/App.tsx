import './styles/App.css';
import './styles.css';
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    //Link
} from 'react-router-dom';
import { HomeView } from './components/views/HomeView';
import { ViewNarrativeContext } from './components/views/ViewNarrativeContext';
import { ViewElement } from './components/views/ViewElement';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/views/LoginView';
import { AuthRepository } from './repositories/auth-repository';
import { AppContext } from './app-context';
import { UpdatingDBIndicator } from './components/UpdatingDBIndicator';
import { SearchBar } from './components/SearchBar';
import { CreateNarrativeContext } from './components/views/CreateNarrativeContext';
import { LogoutView } from './components/views/LogoutView';

export type AppProps = {
    appContext: AppContext;
};

export const App: React.FC<AppProps> = ({ appContext }) => {
    const authRepo = appContext.getRepository(AuthRepository);

    const [userLogged] = useState(authRepo.isAuthenticated());
    const [updatingDB, setUpdatingDB] = useState(false);
    const [searchBarDisplayed, setSearchBarDisplayed] = useState(false);

    appContext.setUpdatingDBIndicator = setUpdatingDB;
    appContext.showSearchBar = () => setSearchBarDisplayed(true);
    appContext.hideSearchBar = () => setSearchBarDisplayed(false);

    return (
        <div className="App">
            {updatingDB ? <UpdatingDBIndicator /> : <></>}
            <Router>
                <Navbar appContext={appContext} />
                {searchBarDisplayed ? <SearchBar appContext={appContext} /> : <></>}
                <div className="RouterContainer">
                    <Routes>
                        {userLogged ? (
                            <>
                                <Route
                                    path="/create-narrative-context"
                                    element={<CreateNarrativeContext appContext={appContext} />}
                                />
                                <Route
                                    path="/narrative-context/:narrativeContextId/:narrativeCategoryId/:elementId"
                                    element={<ViewElement appContext={appContext} />}
                                />
                                <Route
                                    path="/narrative-context/:narrativeContextId"
                                    element={<ViewNarrativeContext appContext={appContext} />}
                                />
                                <Route path="/logout" element={<LogoutView appContext={appContext} />} />
                                <Route path="/" element={<HomeView appContext={appContext} />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/login" element={<LoginView appContext={appContext} />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                                <Route path="/" element={<Navigate to="/login" />} />
                            </>
                        )}
                    </Routes>
                </div>
            </Router>
        </div>
    );
};
