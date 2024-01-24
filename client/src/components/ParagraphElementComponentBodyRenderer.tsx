import '../styles/ParagraphElementComponentBodyRenderer.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { CharacterStatBlock } from './CharacterStatBlock';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import { AppContext } from '../app-context';
import { useRepository } from '../hooks/use-repository';
import { DnD5eCharactersRepository } from '../repositories/dnd5e-characters-repository';
import { DICE_PARSING_REGEX } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD20 } from '@fortawesome/free-solid-svg-icons';
import { useDiceTrayModalVisibleStore } from '../hooks/stores/use-dice-tray-modal-visible-store';

export type ParagraphElementComponentBodyRendererProps = {
    appContext: AppContext;
    body: string;
};

export const ParagraphElementComponentBodyRenderer: React.FC<ParagraphElementComponentBodyRendererProps> = ({
    appContext,
    body,
}) => {
    const [renderedBody, setRenderedBody] = useState<string | undefined>('');
    const [docSections, setDocSections] = useState<any[]>([]);
    const dnd5eCharactersRepository = useRepository(DnD5eCharactersRepository);

    const { rollExpression } = useDiceTrayModalVisibleStore();

    useEffect(() => {
        const _renderedBody = renderBody();
        setRenderedBody(_renderedBody);
        setDocSections(getDocSections(_renderedBody ?? ''));
    }, []);

    useEffect(() => {
        (document as any).rollDiceExpression = (expression: string) => {
            rollExpression(expression);
        };

        return () => {
            (document as any).rollDiceExpression = (expression: string) => {};
        };
    }, []);

    const getCharacter = async (characterId: string) => {
        const character = await dnd5eCharactersRepository.getCharacter(characterId);
        document.getElementById(characterId)!.innerHTML = ReactDOMServer.renderToString(
            <CharacterStatBlock character={character} />
        );
    };

    const getCharacterTempDiv = (characterId: string) => {
        return ReactDOMServer.renderToString(<div id={characterId}></div>);
    };

    const replaceCharacters = (content: string) => {
        const regex = /\[C\]\{([a-zA-Z0-9\-]+)\}/gm;
        if (!content) return;
        const matches = content.matchAll(regex);
        let replaced_body = content;
        for (const match of matches) {
            replaced_body = replaced_body.replace(match[0], getCharacterTempDiv(match[1]));
            setTimeout(() => getCharacter(match[1]), 0);
        }
        return replaced_body;
    };

    const completeDocSections = (content: string): string => {
        // First the string is copied
        let sectionedHtml = content.slice();
        let sectionIndex = 1;
        for (const tag of ['h3', 'h4']) {
            const tags = getTags(content, tag);
            for (const foundTag of tags) {
                const sectionedTag = foundTag.replace(`<${tag}`, `<${tag} id="section_${sectionIndex}"`);
                sectionedHtml = sectionedHtml.replace(foundTag, sectionedTag);
                sectionIndex++;
            }
        }
        return `<span id='title_section' style="margin:0;"></span>${sectionedHtml}`;
    };

    const replaceDiceExpressions = (content: string): string => {
        return content.replace(
            DICE_PARSING_REGEX,
            /*html*/ `<button class="DiceExpressionButton" onclick="document.rollDiceExpression('$&')">${renderToString(
                <FontAwesomeIcon icon={faDiceD20} />
            )} $&</button>`
        );
        //return content.replace(DICE_PARSING_REGEX, renderToString(<button onClick={() => console.log('$0')}>($&)</button>));
    };

    const renderBody = (): string | undefined => {
        let content = replaceCharacters(body);
        if (content) content = completeDocSections(content);
        if (content) content = replaceDiceExpressions(content);
        return content;
    };

    const getTags = (content: string, tag: string): string[] => {
        const matches = [...content.matchAll(new RegExp(`<${tag}>.*?</${tag}>`, 'g'))];
        return matches.map((x: string[]) => x[0]);
    };

    const searchSection = (content: string, tag: string): any | null => {
        const match = content.match(`<${tag} id="(.+)">(.*?)</${tag}>`);
        if (!match) return null;
        return {
            tag,
            id: match[1],
            text: match[2].replace(new RegExp('(<.*>)|(&nbsp;)', 'g'), ''),
        };
    };

    const getDocSections = (content: string): any[] => {
        const sections: any[] = [];
        let chunk = '';
        for (let i = 0; i < content.length; i++) {
            chunk += content.at(i);
            for (const tag of ['h3', 'h4']) {
                const found = searchSection(chunk, tag);
                if (found) {
                    chunk = '';
                    sections.push(found);
                    break;
                }
            }
        }
        return sections;
    };

    return (
        <div className="ParagraphElementBodyRenderer">
            <div className="ParagraphElementBodyRendererContainer">
                <div className="ParagraphElementBodyRendererIndex">
                    <a href="#title_section">
                        <h3>Indice</h3>
                    </a>
                    <div className="ParagraphElementBodyRendererIndexBody">
                        {docSections.map((x: any) => (
                            <a
                                key={`${x.id}_link`}
                                href={`#${x.id}`}
                                className={
                                    {
                                        h3: 'ParagraphElementBodyRendererH3',
                                        h4: 'ParagraphElementBodyRendererH4',
                                    }[x.tag as string]
                                }
                            >
                                {x.text}
                            </a>
                        ))}
                    </div>
                </div>
                <span />
                <div
                    className="ParagraphElementBodyRendererBody"
                    dangerouslySetInnerHTML={{ __html: renderedBody ?? '' }}
                />
            </div>
        </div>
    );
};
