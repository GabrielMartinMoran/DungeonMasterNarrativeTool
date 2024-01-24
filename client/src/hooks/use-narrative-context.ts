type NarrativeContextCallback = (narrativeContextId: string | null) => Promise<void>;

let setNarrativeContextCallback: NarrativeContextCallback = async (narrativeContextId: string | null) => {};
let currentNarrativeContextId: string | null = null;

export const useNarrativeContext = () => {
    return {
        configureSetNarrativeContextCallback: (cb: NarrativeContextCallback) => {
            setNarrativeContextCallback = cb;
        },
        setNarrativeContextById: async (narrativeContextId: string | null) => {
            currentNarrativeContextId = narrativeContextId;
            await setNarrativeContextCallback(narrativeContextId);
        },
        getNarrativeContextId: () => currentNarrativeContextId,
    };
};
