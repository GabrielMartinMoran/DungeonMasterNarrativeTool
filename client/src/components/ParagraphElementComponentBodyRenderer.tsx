import React from 'react';
import { useState, useEffect } from 'react';
import { DnD5eCharactersRepository } from '../repositories/dnd5e-characters-repository';
import { CharacterStatBlock } from './CharacterStatBlock';
import ReactDOMServer from 'react-dom/server';
import { AppContext } from '../app-context';

export type ParagraphElementComponentBodyRendererProps = {
    appContext: AppContext;
    body: string;
};

export const ParagraphElementComponentBodyRenderer: React.FC<ParagraphElementComponentBodyRendererProps> = ({
    appContext,
    body,
}) => {
    const [renderedBody, setRenderedBody] = useState<string | undefined>();
    let htmlBody = null;

    useEffect(() => {
        htmlBody = renderBody();
        setRenderedBody(htmlBody);
    }, [setRenderedBody, htmlBody]);

    const getCharacter = async (characterId: string) => {
        const repo = appContext.getRepository(DnD5eCharactersRepository);
        const character = await repo.getCharacter(characterId);
        document.getElementById(characterId)!.innerHTML = ReactDOMServer.renderToString(
            <CharacterStatBlock character={character} />
        );
    };

    const getCharacterTempDiv = (characterId: string) => {
        return ReactDOMServer.renderToString(<div id={characterId}></div>);
    };

    const replaceCharacters = (html: string) => {
        const regex = /\[C\]\{([a-zA-Z0-9\-]+)\}/gm;
        if (!html) return;
        const matches = html.matchAll(regex);
        let replaced_body = html;
        for (const match of matches) {
            replaced_body = replaced_body.replace(match[0], getCharacterTempDiv(match[1]));
            setTimeout(() => getCharacter(match[1]), 0);
        }
        return replaced_body;
    };

    const renderBody = () => {
        let html = replaceCharacters(body);
        return html;
    };

    return <div dangerouslySetInnerHTML={{ __html: renderedBody ?? '' }} />;
};
