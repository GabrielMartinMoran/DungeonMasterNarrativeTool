import { create } from 'zustand';
import { DiceRoller } from 'dice-roller-parser';

type DiceTrayModalVisibleStore = {
    diceTrayModalVisible: boolean;
    diceRollExpression: string | null;
    diceRollResult: number | null;
    setDiceTrayModalVisible: (newValue: boolean) => void;
    rollExpression: (expression: string | null) => void;
};

const DICE_ROLLER = new DiceRoller();

export const useDiceTrayModalVisibleStore = create<DiceTrayModalVisibleStore>()((set) => ({
    diceTrayModalVisible: false,
    diceRollExpression: null,
    diceRollResult: null,
    setDiceTrayModalVisible: (newValue: boolean) => set((state) => ({ diceTrayModalVisible: newValue })),
    rollExpression: (expression: string | null) =>
        set((state) => ({
            diceRollExpression: expression,
            diceRollResult: expression ? DICE_ROLLER.roll(expression).value : null,
            diceTrayModalVisible: expression !== null,
        })),
}));
