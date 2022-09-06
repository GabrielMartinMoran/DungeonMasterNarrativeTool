import '../../styles/ChangePasswordView.css';
import React, { useEffect, useState } from 'react';
import { AppContext } from '../../app-context';
import { ChangePasswordIcon } from '../icons/ChangePasswordIcon';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useNavigate } from 'react-router-dom';

export type ChangePasswordViewProps = {
    appContext: AppContext;
};

export const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({ appContext }) => {
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [changePasswordBtnEnabled, setChangePasswordBtnEnabled] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        appContext.setBackButtonUrl(null);
        appContext.setForwardButtonUrl(null);
    }, []);

    const onPasswordChange = (event: any) => {
        const _password = event.target.value;
        setPassword(_password);
        validatePasswordsMatch(_password, passwordConfirmation);
    };

    const onPasswordConfirmationChange = (event: any) => {
        const _passwordConfirmation = event.target.value;
        setPasswordConfirmation(_passwordConfirmation);
        validatePasswordsMatch(password, _passwordConfirmation);
    };

    const validatePasswordsMatch = (pass: string, confirmedPass: string) => {
        if (pass !== confirmedPass) {
            setErrorMsg('Las contraseñas no coiciden');
            setChangePasswordBtnEnabled(false);
        } else {
            setErrorMsg(null);
            setChangePasswordBtnEnabled(true);
        }
    };

    const changePassword = async () => {
        try {
            await appContext.repositories.auth.changePassword(password);
            alert('Tu contraseña ha sido cambiada correctamente');
            navigate('/');
        } catch {
            setErrorMsg('Ha ocurrido un error al intentar cambiar tu contraseña');
        }
    };

    return (
        <form className="ChangePasswordView" onSubmit={(e) => e.preventDefault()}>
            <div className="ChangePasswordContainer">
                <h3>Cambiar contraseña</h3>
                <input
                    className="ChangePasswordPasswordInput"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="Contraseña nueva"
                    required={true}
                />
                <input
                    className="ChangePasswordPasswordInput"
                    type="password"
                    name="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={onPasswordConfirmationChange}
                    placeholder="Confirmar contraseña nueva"
                    required={true}
                />
                {errorMsg ? <span className="formErrorMsg">{errorMsg}</span> : null}
                <button type="submit" onClick={changePassword} disabled={!changePasswordBtnEnabled}>
                    <FontAwesomeIcon icon={faKey} /> Cambiar contraseña
                </button>
            </div>
        </form>
    );
};