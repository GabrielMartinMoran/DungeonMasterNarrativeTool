import '../styles/ParagraphElementComponentBodyRenderer.css';
import React, { useRef } from 'react';
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
import { mapDiceExpression } from '../utils/dice-expression-mapper';
import { DND5eToolsStatblock } from './DND5eToolsStatblock';
import { IdGenerator } from '../utils/id-generator';

export type ParagraphElementComponentBodyRendererProps = {
    appContext: AppContext;
    body: string;
};

export const ParagraphElementComponentBodyRenderer: React.FC<ParagraphElementComponentBodyRendererProps> = ({
    appContext,
    body,
}) => {
    const MS_TO_WAIT_BEFORE_REPLACEMENTS = 10;
    const [renderedBody, setRenderedBody] = useState<string | undefined>('');
    const [docSections, setDocSections] = useState<any[]>([]);
    const dnd5eCharactersRepository = useRepository(DnD5eCharactersRepository);
    const renderedDivRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const _renderedBody = renderBody();
        setRenderedBody(_renderedBody);
        setDocSections(getDocSections(_renderedBody ?? ''));
    }, []);

    const replaceCharacters = (content: string) => {
        const regex = /\[C\]\{([a-zA-Z0-9\-]+)\}/gm;
        const matches = content.matchAll(regex);
        let replaced_body = content;
        for (const match of matches) {
            const elementId = match[1];
            replaced_body = replaced_body.replace(match[0], /*html*/ `<div id="${elementId}"></div>`);
            setTimeout(async () => {
                if (!renderedDivRef?.current) return;
                const character = await dnd5eCharactersRepository.getCharacter(elementId);
                const element = renderedDivRef.current.querySelector(`#${elementId}`);
                if (!element) return;
                element.innerHTML = ReactDOMServer.renderToString(<CharacterStatBlock character={character} />);
            }, MS_TO_WAIT_BEFORE_REPLACEMENTS);
        }
        return replaced_body;
    };

    const replace5etoolsStatblocks = (content: string) => {
        const regex = /<div class="__5etools_statblock __se__tag">(?<json>[\w\W]+?)<\/div>/gm;
        const matches = content.matchAll(regex);
        let replaced_body = content;
        for (const match of matches) {
            let rawJson = match[1];
            const elementId = `__5etools_statblock_${IdGenerator.generateId()}`;
            replaced_body = replaced_body.replace(match[0], /*html*/ `<div id="${elementId}"></div>`);
            // We do this in background for not blocking the rendering
            setTimeout(() => {
                if (!renderedDivRef?.current) return;
                let innerHTML = null;
                try {
                    const json = rawJson.replace(/(<\/?[^>]+(>|$)|​)/g, '');
                    const parsed = JSON.parse(json);
                    innerHTML = renderToString(<DND5eToolsStatblock data={parsed} />);
                } catch (error) {
                    console.error('Error parsing 5etools statblock from json:', rawJson);
                }
                const element = renderedDivRef.current.querySelector(`#${elementId}`);
                if (!element) return;
                if (innerHTML) {
                    (element as Element).innerHTML = innerHTML;
                } else {
                    (element as Element).remove();
                }
            }, MS_TO_WAIT_BEFORE_REPLACEMENTS);
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
        if (!content) return content;
        const matches = [...new Set([...content.matchAll(DICE_PARSING_REGEX)].map((x) => x[0]))].sort(
            (a: string, b: string) => b.length - a.length || b.localeCompare(a)
        );
        let replaced_body = content;
        for (const match of matches) {
            const elementId = `__dice_expression_${IdGenerator.generateId()}`;
            replaced_body = replaced_body.replaceAll(match, /*html*/ `<span id="${elementId}">${match[0]}</span>`);
            // We do this in background for not blocking the rendering
            setTimeout(() => {
                if (!renderedDivRef?.current) return;
                // As a dice expression may be repeated, we select all the ones that match
                const elements = renderedDivRef.current.querySelectorAll(`#${elementId}`);
                for (const element of elements) {
                    (element as Element).innerHTML = mapDiceExpression(match, match);
                }
            }, MS_TO_WAIT_BEFORE_REPLACEMENTS);
        }
        return replaced_body;
    };

    const renderBody = (): string | undefined => {
        if (!body) return;
        let content = replaceCharacters(body);
        content = replace5etoolsStatblocks(content);
        content = completeDocSections(content);
        content = replaceDiceExpressions(content);
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
                    ref={renderedDivRef}
                    className="ParagraphElementBodyRendererBody"
                    dangerouslySetInnerHTML={{ __html: renderedBody ?? '' }}
                />
            </div>
        </div>
    );
};
