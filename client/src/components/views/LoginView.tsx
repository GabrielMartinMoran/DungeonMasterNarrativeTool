import '../../styles/LoginView.css';
import React, { useEffect, useState } from 'react';
import { AppContext } from '../../app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { ConnectionError } from '../../errors/connection-error';
import { useRepository } from '../../hooks/use-repository';
import { AuthRepository } from '../../repositories/auth-repository';
import { useNavigationButtonsURLStore } from '../../hooks/stores/use-navigation-buttons-url-store';

export type LoginViewProps = {
    appContext: AppContext;
};

export const LoginView: React.FC<LoginViewProps> = ({ appContext }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginBtnEnabled, setLoginBtnEnabled] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const authRepository = useRepository(AuthRepository);
    const { setBackButtonURL, setForwardButtonURL } = useNavigationButtonsURLStore();

    useEffect(() => {
        setBackButtonURL(null);
        setForwardButtonURL(null);
    }, []);

    const login = async () => {
        try {
            await authRepository.login({
                username,
                password,
            });
        } catch (e: any) {
            if (e instanceof ConnectionError) return setErrorMsg(e.message);
            setErrorMsg('Usuario o contreseña inválidos');
        }
    };

    const onUsernameChange = (event: any) => {
        const _username = event.target.value;
        setUsername(_username);
        validateInputs(_username, password);
    };

    const onPasswordChange = (event: any) => {
        const _password = event.target.value;
        setPassword(_password);
        validateInputs(username, _password);
    };

    const validateInputs = (uname: string, pass: string) => {
        setErrorMsg(null);
        if (!uname || !pass) {
            setLoginBtnEnabled(false);
        } else {
            setLoginBtnEnabled(true);
        }
    };

    return (
        <form className="LoginView" onSubmit={(e) => e.preventDefault()}>
            <h1>🪶 Narrative tools</h1>
            <div className="LoginContainer">
                <h3>Iniciar sesión</h3>
                <input
                    className="LoginUsernameInput"
                    type="text"
                    autoCorrect="off"
                    autoCapitalize="off"
                    name="username"
                    value={username}
                    onChange={onUsernameChange}
                    placeholder="Usuario"
                    autoFocus
                />
                <input
                    className="LoginPasswordInput"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Contraseña"
                />
                {errorMsg ? <span className="formErrorMsg">{errorMsg}</span> : null}
                <button type="submit" onClick={login} disabled={!loginBtnEnabled}>
                    <FontAwesomeIcon icon={faArrowRightToBracket} /> Acceder
                </button>
            </div>
        </form>
    );
};
