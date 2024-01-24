import { create } from 'zustand';

type AddReferenceSearchModalVisibleStore = {
    addReferenceSearchModalVisible: boolean;
    setAddReferenceSearchModalVisible: (newState: boolean) => void;
};

export const useAddReferenceSearchModalVisibleStore = create<AddReferenceSearchModalVisibleStore>()((set) => ({
    addReferenceSearchModalVisible: false,
    setAddReferenceSearchModalVisible: (newValue: boolean) =>
        set((state) => ({ addReferenceSearchModalVisible: newValue })),
}));
