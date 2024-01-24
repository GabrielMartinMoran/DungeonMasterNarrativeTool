import '../../styles/AdminView.css';
import React, { useEffect, useState } from 'react';
import { AppContext } from '../../app-context';
import { ChangePasswordIcon } from '../icons/ChangePasswordIcon';
import { UserIcon } from '../icons/UserIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { CreateUserModal } from '../CreateUserModal';
import { User } from '../../models/user';
import { RenameIcon } from '../icons/RenameIcon';
import { useRepository } from '../../hooks/use-repository';
import { AuthRepository } from '../../repositories/auth-repository';
import { UserRepository } from '../../repositories/user-repository';

export type AdminViewProps = {
    appContext: AppContext;
};

export const AdminView: React.FC<AdminViewProps> = ({ appContext }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const authRepository = useRepository(AuthRepository);
    const userRepository = useRepository(UserRepository);

    useEffect(() => {
        const init = async () => {
            setUsers(await getUsers());
        };
        init();
    }, []);

    const getUsers = async () => {
        const allUsers = await userRepository.list();
        // We use getAuthenticatedUsername because it can't be null if the user is logged
        return allUsers.filter((user: User) => user.username !== authRepository.getAuthenticatedUsername());
    };

    const changeName = async (user: User) => {
        const name = window.prompt(`Ingresa el nuevo nombre para el usuario ${user.name} (${user.username})`);
        if (!name) return;
        await userRepository.changeName(user.username, name);
        setUsers(await getUsers());
        alert(`El nombre del usuario ${user.username} se ha cambiado correctamente a ${name}`);
    };

    const changePassword = async (user: User) => {
        const password = window.prompt(`Ingresa el nuevo nombre para el usuario ${user.name} (${user.username})`);
        if (!password) return;
        await userRepository.changePassword(user.username, password);
        alert(`La contraseña del usuario ${user.name} (${user.username}) se ha cambiado correctamente`);
    };

    const onUserCreated = async () => {
        setUsers(await getUsers());
    };

    const deleteUser = async (user: User) => {
        const shouldDelete = window.confirm(
            `Estas seguro que deseas eliminar el usuario ${user.name} (${user.username})`
        );
        if (!shouldDelete) return;
        await userRepository.delete(user.username);
        setUsers(await getUsers());
        alert(`El usuario ${user.name} (${user.username}) ha sido eliminado correctamente`);
    };

    return (
        <div>
            {showCreateUserModal ? (
                <CreateUserModal
                    appContext={appContext}
                    onClosed={() => setShowCreateUserModal(false)}
                    onUserCreated={onUserCreated}
                />
            ) : null}
            <div className="AdminViewUsersTitleContainer">
                <h1 className="flex1">👥 Usuarios</h1>
                <div className="AdminViewUsersTitleButtons">
                    <button onClick={() => setShowCreateUserModal(true)}>
                        <FontAwesomeIcon icon={faUserPlus} color={'#012187'} /> Crear usuario
                    </button>
                </div>
            </div>
            {users.map((user: User) => (
                <div className="AdminViewUser" key={user.username}>
                    <span>
                        <UserIcon /> {user.name} ({user.username})
                    </span>
                    <div>
                        <button onClick={() => changeName(user)}>
                            <RenameIcon /> Cambiar nombre
                        </button>
                        <button onClick={() => changePassword(user)}>
                            <ChangePasswordIcon /> Cambiar contraseña
                        </button>
                        <button onClick={() => deleteUser(user)}>
                            <DeleteIcon /> Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
