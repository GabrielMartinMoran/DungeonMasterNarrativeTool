import '../../styles/LoginView.css';
import React, { useEffect, useState } from 'react';
import { AuthRepository } from '../../repositories/auth-repository';
import { AppContext } from '../../app-context';

export type LoginViewProps = {
    appContext: AppContext;
};

export const LoginView: React.FC<LoginViewProps> = ({ appContext }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
    }, [appContext]);

    const login = async () => {
        try {
            await appContext.getRepository(AuthRepository).login({
                username,
                password,
            });
        } catch {
            alert('Usuario o contreseña inválidos!');
        }
    };

    return (
        <form className="LoginView" onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Usuario"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
            />
            <button type="submit" onClick={login}>
                Iniciar sesión
            </button>
        </form>
    );
};
