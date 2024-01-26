import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { renderToString } from 'react-dom/server';

export const mapDiceExpression = (display: string, fullExpression: string) => {
    return /*html*/ `<button class="DiceExpressionButton" onclick="document.rollDiceExpression('${fullExpression}')">${renderToString(
        <FontAwesomeIcon icon={faDiceD20} />
    )} ${display}</button>`;
};

