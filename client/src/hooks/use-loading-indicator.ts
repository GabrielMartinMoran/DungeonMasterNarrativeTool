type LoadingIndicatorCallback = (value: boolean) => void;

export let loadingIndicatorCallback = (value: boolean) => {};

export const useLoadingIndicator = () => {
    return {
        configureLoadingIndicatorCallback: (cb: LoadingIndicatorCallback) => {
            loadingIndicatorCallback = cb;
        },
        setIsLoading: (value: boolean) => loadingIndicatorCallback(value),
    };
};
