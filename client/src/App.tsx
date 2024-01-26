import './styles/variables.css';
import './styles/App.css';
import './styles.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomeView } from './components/views/HomeView';
import { ViewNarrativeContext } from './components/views/ViewNarrativeContext';
import { ViewElement } from './components/views/ViewElement';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/views/LoginView';
import { AppContext } from './app-context';
import { UpdatingDBIndicator } from './components/UpdatingDBIndicator';
import { CreateNarrativeContext } from './components/views/CreateNarrativeContext';
import { LogoutView } from './components/views/LogoutView';
import { Menu } from './components/Menu';
import { AdminView } from './components/views/AdminView';
import { THEMES } from './themes';
import { ChangePasswordView } from './components/views/ChangePasswordView';
import { LocationChangeDetector } from './components/LocationChangeDetector';
import { NavigationSearchModal } from './components/search/NavigationSearchModal';
import { useLoadingIndicator } from './hooks/use-loading-indicator';
import { useRepository } from './hooks/use-repository';
import { AuthRepository } from './repositories/auth-repository';
import { HealthRepository } from './repositories/health-repository';
import { useNavigationSearchModalVisibleStore } from './hooks/stores/use-navigation-search-modal-visible-store';
import { KeyboardShortcursHandler } from './components/handlers/KeyboardShortcutsHandler';
import { useDiceTrayModalVisibleStore } from './hooks/stores/use-dice-tray-modal-visible-store';
import { DiceTrayModal } from './components/DiceTrayModal';
import { ChangelogView } from './components/views/ChangelogView';

export type AppProps = {
    appContext: AppContext;
};

export const App: React.FC<AppProps> = ({ appContext }) => {
    const CHECK_HEALTH_INTERVAL_MS = 5 * 60 * 1000; // Once each 5 minutes
    const authRepository = useRepository(AuthRepository);
    const healthRepository = useRepository(HealthRepository);
    const [userLogged] = useState(authRepository.isAuthenticated());
    const [loadingIndicatorVisible, setLoadingIndicatorVisible] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [currentThemeName, setCurrentThemeName] = useState<string>(localStorage.getItem('theme') ?? 'light');
    const [healthInterval, setHealthInterval] = useState<NodeJS.Timer | null>(null);

    const { navigationSearchModalVisible } = useNavigationSearchModalVisibleStore();
    const { diceTrayModalVisible } = useDiceTrayModalVisibleStore();

    const { configureLoadingIndicatorCallback } = useLoadingIndicator();

    configureLoadingIndicatorCallback(setLoadingIndicatorVisible);

    const { rollExpression } = useDiceTrayModalVisibleStore();

    useEffect(() => {
        (document as any).rollDiceExpression = (expression: string) => {
            rollExpression(expression);
        };

        return () => {
            (document as any).rollDiceExpression = (expression: string) => {};
        };
    }, []);

    const applyTheme = (theme: any) => {
        for (const [prop, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(prop, value as string);
        }
    };

    const checkHealth = async () => {
        try {
            await healthRepository.checkHealth();
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
            <KeyboardShortcursHandler />
            {loadingIndicatorVisible ? <UpdatingDBIndicator /> : null}
            <Router>
                <LocationChangeDetector appContext={appContext} />
                {userLogged ? (
                    <>
                        <Navbar appContext={appContext} toggleShowMenu={toggleShowMenu} />
                        {navigationSearchModalVisible ? <NavigationSearchModal appContext={appContext} /> : null}
                        {diceTrayModalVisible ? <DiceTrayModal /> : null}
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
                                    <Route path="/changelog" element={<ChangelogView appContext={appContext} />} />
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
