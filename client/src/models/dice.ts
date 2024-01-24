import { DiceResult } from './dice-result';

export class Dice {
    protected _faces: number;

    public constructor(faces: number) {
        this._faces = faces;
    }

    public roll(): DiceResult {
        const result = Math.floor(Math.random() * (this._faces + 1));
        return new DiceResult(this, result);
    }
}
