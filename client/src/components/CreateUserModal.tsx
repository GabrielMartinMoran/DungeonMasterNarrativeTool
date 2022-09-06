import '../styles/CreateUserModal.css';
import React, { useState } from 'react';
import { AppContext } from '../app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

export type CreateUserModalProps = {
    appContext: AppContext;
    onClosed: () => void;
    onUserCreated: () => Promise<void>;
};

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ appContext, onClosed, onUserCreated }) => {
    const ROLES: any[] = [
        {
            role: 'commoner',
            text: 'Usuario común',
        },
        {
            role: 'admin',
            text: 'Administrador',
        },
    ];

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('commoner');
    const [createBtnEnabled, setCreateBtnEnabled] = useState(false);

    const createUser = async () => {
        await appContext.repositories.user.create(username, name, password, role);
        await onUserCreated();
        onClosed();
    };

    const onInputChange = (name: string, username: string, password: string) => {
        setCreateBtnEnabled(Boolean(name) && Boolean(username) && Boolean(password));
    };

    return (
        <form className="CreateUserModal" onSubmit={(e) => e.preventDefault()}>
            <h3>Crear usuario</h3>
            <input
                className="LoginNameInput"
                type="text"
                autoCorrect="off"
                name="name"
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                    onInputChange(event.target.value, username, password);
                }}
                placeholder="Nombre"
                autoFocus
            />
            <input
                className="LoginUsernameInput"
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                name="username"
                value={username}
                onChange={(event) => {
                    setUsername(event.target.value);
                    onInputChange(name, event.target.value, password);
                }}
                placeholder="Nombre de usuario"
            />
            <input
                className="LoginPasswordInput"
                type="password"
                name="password"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value);
                    onInputChange(name, username, event.target.value);
                }}
                placeholder="Contraseña"
            />
            <select onChange={(event) => setRole(event.target.value)}>
                {ROLES.map((x) => (
                    <option key={x.role} value={x.role}>
                        {x.text}
                    </option>
                ))}
            </select>
            <button type="submit" onClick={createUser} disabled={!createBtnEnabled}>
                <FontAwesomeIcon icon={faUserPlus} /> Crear
            </button>
            <button onClick={onClosed}>
                <FontAwesomeIcon icon={faXmark} /> Cerrar
            </button>
        </form>
    );
};
