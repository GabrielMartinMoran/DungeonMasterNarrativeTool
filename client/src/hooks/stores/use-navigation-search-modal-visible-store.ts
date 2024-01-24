import { create } from 'zustand';

type NavigationSearchModalVisibleStore = {
    navigationSearchModalVisible: boolean;
    setNavigationSearchModalVisible: (newState: boolean) => void;
};

export const useNavigationSearchModalVisibleStore = create<NavigationSearchModalVisibleStore>()((set) => ({
    navigationSearchModalVisible: false,
    setNavigationSearchModalVisible: (newValue: boolean) =>
        set((state) => ({ navigationSearchModalVisible: newValue })),
}));
