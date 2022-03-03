import React from 'react';
import { useState, useEffect } from 'react';
import { DnD5eCharactersRepository } from '../repositories/dnd5e-characters-repository';
import { CharacterStatBlock } from './CharacterStatBlock';
import ReactDOMServer from 'react-dom/server';

export function ParagraphElementComponentBodyRenderer({ appContext, body }) {

    const [renderedBody, setRenderedBody] = useState();
    let htmlBody = null;

    useEffect(() => {
        htmlBody = renderBody();
        setRenderedBody(htmlBody);
    }, [setRenderedBody, htmlBody]);

    const getCharacter = async (characterId) => {
        const repo = appContext.getRepository(DnD5eCharactersRepository);
        const character = await repo.getCharacter(characterId);
        document.getElementById(characterId).innerHTML = ReactDOMServer.renderToString(<CharacterStatBlock character={character} />);
    }

    const getCharacterTempDiv = (characterId) => {
        return ReactDOMServer.renderToString(<div id={characterId}></div>);
    }

    const replaceCharacters = (html) => {
        const regex = /\[C\]\{([a-zA-Z0-9\-]+)\}/gm;
        const matches = html.matchAll(regex);
        let replaced_body = html;
        for (const match of matches) {
            replaced_body = replaced_body.replace(match[0], getCharacterTempDiv(match[1]));
            setTimeout(() => getCharacter(match[1]), 0);
        }
        return replaced_body;
    }

    const renderBody = () => {
        let html = replaceCharacters(body);
        return html;
    }


    return <div dangerouslySetInnerHTML={{ __html: renderedBody }} />;
}