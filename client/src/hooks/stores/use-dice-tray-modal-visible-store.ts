import { create } from 'zustand';
import { DiceRollResult, DiceRoller, RollBase } from 'dice-roller-parser';

type DiceTrayModalVisibleStore = {
    diceTrayModalVisible: boolean;
    diceRollExpression: string | null;
    diceRollResult: DiceRollResult | null;
    setDiceTrayModalVisible: (newValue: boolean) => void;
    rollExpression: (expression: string | null) => void;
    rerollExpression: () => void;
};

const DICE_ROLLER = new DiceRoller();

export const useDiceTrayModalVisibleStore = create<DiceTrayModalVisibleStore>()((set) => ({
    diceTrayModalVisible: false,
    diceRollExpression: null,
    diceRollResult: null,
    setDiceTrayModalVisible: (newValue: boolean) => set((state) => ({ diceTrayModalVisible: newValue })),
    rollExpression: (expression: string | null) =>
        set((state) => ({
            diceRollExpression: expression?.toLowerCase(),
            diceRollResult: expression ? (DICE_ROLLER.roll(expression?.toLowerCase()) as DiceRollResult) : null,
            diceTrayModalVisible: expression !== null,
        })),
    rerollExpression: () =>
        set((state) => ({
            diceRollResult: state.diceRollExpression?.toLowerCase()
                ? (DICE_ROLLER.roll(state.diceRollExpression?.toLowerCase()) as DiceRollResult)
                : null,
        })),
}));
