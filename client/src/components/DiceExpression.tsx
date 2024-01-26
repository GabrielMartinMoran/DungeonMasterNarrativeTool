import React from 'react';
import { mapDiceExpression } from '../utils/dice-expression-mapper';

export type DiceExpressionProps = {
    display: string;
    fullExpression: string;
};

export const DiceExpression: React.FC<DiceExpressionProps> = ({ display, fullExpression }) => {
    return <span dangerouslySetInnerHTML={{ __html: mapDiceExpression(display, fullExpression) }}></span>;
};
