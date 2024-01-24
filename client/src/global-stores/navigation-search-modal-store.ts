import { create } from 'zustand';

type ShowNavigationSearchModalStore = {
    visible: boolean;
    setVisible: (newState: boolean) => void;
};

export const useShowNavigationSearchModalStore = create<ShowNavigationSearchModalStore>((set) => ({
    visible: false,
    setVisible: (newState: boolean) => set((state) => ({ visible: newState })),
}));
