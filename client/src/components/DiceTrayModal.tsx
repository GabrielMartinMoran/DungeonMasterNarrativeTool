import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDiceTrayModalVisibleStore } from '../hooks/stores/use-dice-tray-modal-visible-store';
import '../styles/DiceTrayModal.css';
import React from 'react';
import { faDiceD20, faXmark } from '@fortawesome/free-solid-svg-icons';

export const DiceTrayModal: React.FC = () => {
    const { setDiceTrayModalVisible, rerollExpression, diceRollExpression, diceRollResult } =
        useDiceTrayModalVisibleStore();

    return (
        <div className="DiceTrayModal">
            {diceRollResult ? (
                <div>
                    <p>
                        <u>Tirando</u>
                    </p>
                    <p>
                        <i>
                            <FontAwesomeIcon icon={faDiceD20} /> {diceRollExpression}
                        </i>
                    </p>
                    <p>
                        <u>Resultado</u>
                    </p>
                    <p className="DiceTrayModalResult">{diceRollResult.value}</p>
                </div>
            ) : null}

            <button onClick={() => rerollExpression()}>
                <FontAwesomeIcon icon={faDiceD20} /> Volver a tirar
            </button>
            <button onClick={() => setDiceTrayModalVisible(false)}>
                <FontAwesomeIcon icon={faXmark} /> Cerrar
            </button>
        </div>
    );
};
