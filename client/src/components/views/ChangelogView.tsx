import React, { useEffect, useState } from 'react';
import { AppContext } from '../../app-context';
import { useNavigationButtonsURLStore } from '../../hooks/stores/use-navigation-buttons-url-store';
import ReactMarkdown from 'react-markdown';
import { useRepository } from '../../hooks/use-repository';
import { ChangelogRepository } from '../../repositories/changelog-repository';

export type ChangelogViewProps = {
    appContext: AppContext;
};

export const ChangelogView: React.FC<ChangelogViewProps> = ({ appContext }) => {
    const { setBackButtonURL, setForwardButtonURL } = useNavigationButtonsURLStore();
    const changelogRepository = useRepository(ChangelogRepository);

    const [changelog, setChangelog] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            setBackButtonURL('/');
            setForwardButtonURL(null);

            setIsLoading(true);

            setChangelog(await changelogRepository.get());

            setIsLoading(false);
        };

        init();
    }, []);

    return (
        <div>
            <h1>📜 Historial de cambios</h1>
            <div>
                {isLoading ? <p>Cargando historial de cambios...</p> : <ReactMarkdown>{changelog}</ReactMarkdown>}
            </div>
        </div>
    );
};
