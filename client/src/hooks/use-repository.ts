type RepositoryType = new () => any;

const repositories = new Map<RepositoryType, any>();

export const getOrInstantiateRepository = <T>(repositoryType: new () => T): T => {
    if (!repositories.has(repositoryType)) {
        repositories.set(repositoryType, new repositoryType());
    }
    return repositories.get(repositoryType) as T;
};

export const useRepository = <T>(repositoryType: new () => T): T => {
    return getOrInstantiateRepository(repositoryType);
};
