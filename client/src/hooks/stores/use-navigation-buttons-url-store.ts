import { create } from 'zustand';

type NavigationButtonsURLStore = {
    backButtonURL: string | null;
    forwardButtonURL: string | null;
    setBackButtonURL: (newState: string | null) => void;
    setForwardButtonURL: (newState: string | null) => void;
};

export const useNavigationButtonsURLStore = create<NavigationButtonsURLStore>()((set) => ({
    backButtonURL: null,
    forwardButtonURL: null,
    setBackButtonURL: (newValue: string | null) => set((state) => ({ backButtonURL: newValue })),
    setForwardButtonURL: (newValue: string | null) => set((state) => ({ forwardButtonURL: newValue })),
}));
