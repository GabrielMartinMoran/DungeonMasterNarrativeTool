import '../styles/LoginView.css';
import React, { useEffect, useRef, useState } from 'react';
import { AuthRepository } from '../repositories/auth-repository';
import { useNavigate } from '../../node_modules/react-router/index';

export function LoginView({ appContext }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
    }, [appContext]);

    const login = async () => {
        try {
            await appContext.getRepository(AuthRepository).login({
                username, password
            });
        } catch {
            alert('Usuario o contreseña inválidos!');
        }
        
    }

    return <form className="LoginView" onSubmit={e => e.preventDefault()}>
        <input type='text' name='username' onChange={(event) => setUsername(event.target.value)} placeholder='Usuario' />
        <input type='password' name='password' onChange={(event) => setPassword(event.target.value)} placeholder='Contraseña' />
        <button type='submit' onClick={login}>Iniciar sesión</button>
    </form>;

}