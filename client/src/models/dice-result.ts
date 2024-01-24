import { Dice } from './dice';

export class DiceResult {
    protected _dice: Dice;
    protected _result: number;

    public constructor(dice: Dice, result: number) {
        this._dice = dice;
        this._result = result;
    }

    public get dice(): Dice {
        return this._dice;
    }

    public get result(): number {
        return this._result;
    }
}
