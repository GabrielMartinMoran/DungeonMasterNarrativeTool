import './styles/variables.css';
import './styles/App.css';
import './styles.css';
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
    //Link
} from 'react-router-dom';
import { HomeView } from './components/views/HomeView';
import { ViewNarrativeContext } from './components/views/ViewNarrativeContext';
import { ViewElement } from './components/views/ViewElement';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/views/LoginView';
import { AppContext } from './app-context';
import { UpdatingDBIndicator } from './components/UpdatingDBIndicator';
import { SearchBar } from './components/search/SearchBar';
import { CreateNarrativeContext } from './components/views/CreateNarrativeContext';
import { LogoutView } from './components/views/LogoutView';
import { Menu } from './components/Menu';
import { AdminView } from './components/views/AdminView';
import { THEMES } from './themes';
import { ChangePasswordView } from './components/views/ChangePasswordView';
import { LocationChangeDetector } from './components/LocationChangeDetector';
import { NavigationSearchModal } from './components/search/NavigationSearchModal';
import { useShowNavigationSearchModalStore } from './global-stores/navigation-search-modal-store';

export type AppProps = {
    appContext: AppContext;
};

export const App: React.FC<AppProps> = ({ appContext }) => {
    const CHECK_HEALTH_INTERVAL_MS = 5 * 60 * 1000; // Once each 5 minutes
    const [userLogged] = useState(appContext.repositories.auth.isAuthenticated());
    const [updatingDB, setUpdatingDB] = useState(false);
    const [navigationSearchModalDisplayed, setSearchBarDisplayed] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentThemeName, setCurrentThemeName] = useState<string>(localStorage.getItem('theme') ?? 'light');
    const [healthInterval, setHealthInterval] = useState<NodeJS.Timer | null>(null);

    appContext.setUpdatingDBIndicator = setUpdatingDB;
    appContext.showSearchBar = () => setSearchBarDisplayed(true);
    appContext.hideSearchBar = () => setSearchBarDisplayed(false);

    const applyTheme = (theme: any) => {
        for (const [prop, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(prop, value as string);
        }
    };

    const checkHealth = async () => {
        try {
            await appContext.repositories.health.checkHealth();
        } catch (e) {
            console.log('Error checking the server health status!');
        }
    };

    useEffect(() => {
        const init = async () => {
            applyTheme((THEMES as any)[currentThemeName]);
            await appContext.pullAuthenticatedUserInfo();
            setHealthInterval(setInterval(checkHealth, CHECK_HEALTH_INTERVAL_MS));
        };

        init();

        return () => {
            clearInterval(healthInterval!);
            setHealthInterval(null);
        };
    }, []);

    const changeTheme = () => {
        const themeName = currentThemeName === 'dnd' ? 'light' : 'dnd';
        localStorage.setItem('theme', themeName);
        setCurrentThemeName(themeName);
        applyTheme(THEMES[themeName]);
    };

    const toggleShowMenu = () => setShowMenu(!showMenu);

    return (
        <div className="App">
            {updatingDB ? <UpdatingDBIndicator /> : <></>}
            <Router>
                <LocationChangeDetector appContext={appContext} />
                {userLogged ? (
                    <>
                        <Navbar appContext={appContext} toggleShowMenu={toggleShowMenu} />
                        {navigationSearchModalDisplayed ? <NavigationSearchModal appContext={appContext} /> : <></>}
                    </>
                ) : null}
                <div className="AppContainer">
                    {showMenu ? (
                        <Menu appContext={appContext} hideMenu={() => setShowMenu(false)} changeTheme={changeTheme} />
                    ) : null}
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
                                    <Route path="/password" element={<ChangePasswordView appContext={appContext} />} />
                                    <Route path="/admin" element={<AdminView appContext={appContext} />} />
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
                </div>
            </Router>
        </div>
    );
};
