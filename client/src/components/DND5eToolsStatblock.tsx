import React from 'react';
import { DiceExpression } from './DiceExpression';
import '../styles/DND5eToolsStatblock.css';
import { mapDiceExpression } from '../utils/dice-expression-mapper';
import { renderToString } from 'react-dom/server';
import { DND_5E_TOOLS_PATHS, DND_5E_TOOLS_URL, DND_5E_TOOLS_URL_DEFAULT_SOURCE } from '../config';

export type DND5eToolsStatblockProps = {
    data: any;
};

export const DND5eToolsStatblock: React.FC<DND5eToolsStatblockProps> = ({ data }) => {
    const PROPS_MAPPING: any = {
        size: {
            T: 'Tiny',
            S: 'Small',
            M: 'Medium',
            L: 'Large',
            H: 'Huge',
            G: 'Gargantuan',
        },
        alignment: {
            A: 'Any Alignment',
            C: 'Chaotic',
            E: 'Evil',
            G: 'Good',
            L: 'Lawful',
            N: 'Neutral',
            NX: 'Neutral',
        },
        abilityScoreModifiers: {
            1: '-5',
            2: '-4',
            3: '-4',
            4: '-3',
            5: '-3',
            6: '-2',
            7: '-2',
            8: '-1',
            9: '-1',
            10: '+0',
            11: '+0',
            12: '+1',
            13: '+1',
            14: '+2',
            15: '+2',
            16: '+3',
            17: '+3',
            18: '+4',
            19: '+4',
            20: '+5',
            21: '+5',
            22: '+6',
            23: '+6',
            24: '+7',
            25: '+7',
            26: '+8',
            27: '+8',
            28: '+9',
            29: '+9',
            30: '+10',
        },
        xpPerCR: {
            0: 10,
            '1/8': 25,
            '1/4': 50,
            '1/2': 100,
            1: 200,
            2: 450,
            3: 700,
            4: 1100,
            5: 1800,
            6: 2300,
            7: 2900,
            8: 3900,
            9: 5000,
            10: 5900,
            11: 7200,
            12: 8400,
            13: 10000,
            14: 11500,
            15: 13000,
            16: 15000,
            17: 18000,
            18: 20000,
            19: 22000,
            20: 25000,
            21: 33000,
            22: 41000,
            23: 50000,
            24: 62000,
            25: 75000,
            26: 90000,
            27: 105000,
            28: 120000,
            29: 135000,
            30: 155000,
        },
        proficiencyBonus: {
            0: '+2',
            '1/8': '+2',
            '1/4': '+2',
            '1/2': '+2',
            1: '+2',
            2: '+2',
            3: '+2',
            4: '+2',
            5: '+3',
            6: '+3',
            7: '+3',
            8: '+3',
            9: '+4',
            10: '+4',
            11: '+4',
            12: '+4',
            13: '+5',
            14: '+5',
            15: '+5',
            16: '+5',
            17: '+6',
            18: '+6',
            19: '+6',
            20: '+6',
            21: '+7',
            22: '+7',
            23: '+7',
            24: '+7',
            25: '+8',
            26: '+8',
            27: '+8',
            28: '+8',
            29: '+9',
            30: '+9',
        },
        defaultLegendaryActions: 3,
        levelMapping: {
            1: '1st-level',
            2: '2nd-level',
            3: '4rd-level',
            4: '4th-level',
            5: '5th-level',
            6: '6th-level',
            7: '7th-level',
            8: '8th-level',
            9: '9th-level',
            10: '10th-level',
            11: '11th-level',
            12: '12th-level',
            13: '13th-level',
            14: '14th-level',
            15: '15th-level',
            16: '16th-level',
            17: '17th-level',
            18: '18th-level',
            19: '19th-level',
            20: '20th-level',
        },
    };

    const mapAlignment = (alignment: string[]): string => {
        const anyAligment = ['L', 'NX', 'C'];
        const isAny = anyAligment.every((x) => alignment.includes(x));
        if (isAny) {
            return `Any ${alignment
                .filter((x) => !anyAligment.includes(x))
                .map((alignment: string) => PROPS_MAPPING.alignment[alignment])
                .join(' ')} Alignment`;
        }
        return alignment.map((alignment: string) => PROPS_MAPPING.alignment[alignment]).join(' ');
    };

    const mapTypeSection = () => {
        const typeStr =
            typeof data.type === 'string'
                ? titleCase(data.type)
                : `${titleCase(data.type.type)}${
                      data.type.tags ? ' (' + data.type.tags.map((tag: string) => titleCase(tag)).join(', ') + ')' : ''
                  }`;
        return `${data.level ? PROPS_MAPPING.levelMapping[data.level] + ' ' : ''}${
            PROPS_MAPPING.size[data.size[0]]
        } ${typeStr}, ${data.alignmentPrefix ?? ''}${mapAlignment(data.alignment)}`;
    };

    const mapAbilityScore = (score: number) => {
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: mapDiceExpression(
                        `${score} (${PROPS_MAPPING.abilityScoreModifiers[score]})`,
                        `1d20${PROPS_MAPPING.abilityScoreModifiers[score]}`
                    ),
                }}
            />
        );
    };

    const titleCase = (str: string) => {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
    };

    const map5eToolsReference = (reference: string) => {
        if (reference.includes('@spell')) {
            const regex = /\{@spell (?<spell>[\w' ]+)(?:\|(?<source>[\w ]+))?\}/gm;
            const match = regex.exec(reference);
            const spell = match?.groups?.spell;
            const source = match?.groups?.source;
            return /*html*/ `<a href="${DND_5E_TOOLS_URL}${DND_5E_TOOLS_PATHS.spells}${spell}_${
                source ? source : DND_5E_TOOLS_URL_DEFAULT_SOURCE
            }">${spell}</a>`;
        }
        if (reference.includes('@item')) {
            const regex = /\{@item (?<item>[\w' \(\)]+)(?:\|(?<source>[\w ]+))?\}/gm;
            const match = regex.exec(reference);
            const item = match?.groups?.item;
            const source = match?.groups?.source;
            return /*html*/ `<a href="${DND_5E_TOOLS_URL}${DND_5E_TOOLS_PATHS.items}${item}_${
                source ? source : DND_5E_TOOLS_URL_DEFAULT_SOURCE
            }">${item}</a>`;
        }
        if (reference.includes('@damage')) {
            const regex = /\{@damage ([\w\+\- ]+)}/gm;
            return reference.replace(regex, mapDiceExpression('$1', '$1'));
        }
        if (reference.includes('@hit')) {
            const regex = /\{@hit (?<modifier>[\w\+\- ]+)}/gm;
            const modifier = regex.exec(reference)?.groups?.modifier!;
            const addPlus = !(modifier.startsWith('+') || modifier.startsWith('-'));
            return reference.replace(
                regex,
                mapDiceExpression(`${addPlus ? '+' : ''}$1`, `1d20${addPlus ? '+' : ''}$1`)
            );
        }
        if (reference.includes('@dc')) {
            const regex = /\{@dc (\d+)}/gm;
            return reference.replace(regex, `DC $1`);
        }
        if (reference.includes('@dice')) {
            const regex = /\{@dice ([\w\+\- ]+)}/gm;
            return reference.replace(regex, mapDiceExpression('$1', '$1'));
        }
        if (reference.includes('@condition')) {
            const regex = /\{@condition (?<condition>[\w ]+)(?:\|(?<source>[\w ]+))?\}/gm;
            const match = regex.exec(reference);
            const condition = match?.groups?.condition;
            const source = match?.groups?.source ?? DND_5E_TOOLS_URL_DEFAULT_SOURCE;
            return /*html*/ `<a href="${DND_5E_TOOLS_URL}${DND_5E_TOOLS_PATHS.conditions}${condition}${
                source ? '_' + source : ''
            }">${condition}</a>`;
        }
        if (reference.includes('@recharge')) {
            const regex = /\{@recharge ?(?<minValue>\d+)?\}/gm;
            const match = regex.exec(reference);
            const minValue = parseInt(match?.groups?.minValue ?? '6');
            const rangeExpression = minValue < 6 ? `${minValue}-6` : `${minValue}`;
            return reference.replace(regex, `(Recharge ${mapDiceExpression(rangeExpression, `1d6`)})`);
        }
        if (reference.includes('@i')) {
            const regex = /\{@i ([^\}]+)\}/gm;
            return reference.replace(regex, '<i>$1</i>');
        }
        if (reference === '{@h}') return '<i>Hit:</i> ';
        if (reference === '{@atk mw}') return '<i>Melee Weapon Attack:</i>';
        if (reference === '{@atk rw}') return '<i>Ranged Weapon Attack:</i>';
        if (reference === '{@atk ms}') return '<i>Melee Spell Attack:</i>';
        if (reference === '{@atk rs}') return '<i>Ranged Spell Attack:</i>';
        if (reference === '{@atk mw,rw}') return '<i>Melee or Ranged Weapon Attack:</i>';
        return reference;
    };

    const map5eToolsReferences = (text: string) => {
        const regex = /\{@[^\}]+\}/gm;
        let replaced = text;
        for (const match of text.match(regex) ?? []) {
            replaced = replaced.replaceAll(match, map5eToolsReference(match));
        }
        return replaced;
    };

    const renderActionOrTrait = (action: any, key: string) => {
        return (
            <p key={`${data.name}_${key}_${action.name}`}>
                <strong dangerouslySetInnerHTML={{ __html: map5eToolsReferences(action.name) + '. ' }} />
                <span dangerouslySetInnerHTML={{ __html: map5eToolsReferences(action.entries.join('<br/>')) }} />
            </p>
        );
    };

    const mapCondition = (condition: string) => {
        return /*html*/ `<a href="${DND_5E_TOOLS_URL}${DND_5E_TOOLS_PATHS.conditions}${condition}_${DND_5E_TOOLS_URL_DEFAULT_SOURCE}">${condition}</a>`;
    };

    const mapResistancesAndInmunities = (groups: any[], groupKey: string) => {
        let hasGroups = false;
        return groups
            .map((group: string | any) => {
                if (typeof group === 'string') return group;
                hasGroups = true;
                return (group[groupKey] ?? []).join(', ') + (group.note ?? '');
            })
            .join(hasGroups ? '; ' : ', ');
    };

    const mapSpeed = () => {
        const speeds = [];
        if (data.speed.walk) speeds.push(`${data.speed.walk} ft.`);
        for (const source of Object.keys(data.speed)) {
            if (source === 'walk') continue;
            speeds.push(
                `${source} ${data.speed[source].number} ft.${
                    data.speed[source].condition ? ' ' + map5eToolsReferences(data.speed[source].condition) : ''
                }`
            );
        }
        return <span dangerouslySetInnerHTML={{ __html: speeds.join(', ') }} />;
    };

    return (
        <div className="DND5eToolsStatblock">
            <h3>{data.name}</h3>
            <small>
                <i>{mapTypeSection()}</i>
            </small>
            <p>
                <strong>Armor Class</strong>{' '}
                {data.ac.map((armor: string | any) => {
                    let acHtml = '';
                    let acValue = 0;
                    if (armor.from) {
                        acHtml = `${armor.ac} (${map5eToolsReferences(armor.from.join(', '))})`;
                        acValue = armor.ac;
                    } else if (armor.condition) {
                        acHtml = ` ${armor.braces ? '(' : ''}${armor.ac}${
                            armor.condition ? ' ' + map5eToolsReferences(armor.condition) : ''
                        }${armor.braces ? ')' : ''}`;
                        acValue = armor.ac;
                    } else {
                        acHtml = map5eToolsReferences(armor.toString());
                        acValue = armor;
                    }
                    return <span key={`${data.name}_ac_${acValue}`} dangerouslySetInnerHTML={{ __html: acHtml }} />;
                })}
            </p>
            <p>
                <strong>Hit Points</strong> {data.hp.average} (
                <DiceExpression display={data.hp.formula} fullExpression={data.hp.formula} />)
            </p>
            <p>
                <strong>Speed</strong> {mapSpeed()}
            </p>
            <hr />
            <table>
                <tbody>
                    <tr>
                        <th>STR</th>
                        <th>DEX</th>
                        <th>CON</th>
                        <th>INT</th>
                        <th>WIS</th>
                        <th>CHA</th>
                    </tr>
                    <tr>
                        <td>{mapAbilityScore(data.str)}</td>
                        <td>{mapAbilityScore(data.dex)}</td>
                        <td>{mapAbilityScore(data.con)}</td>
                        <td>{mapAbilityScore(data.int)}</td>
                        <td>{mapAbilityScore(data.wis)}</td>
                        <td>{mapAbilityScore(data.cha)}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            {data.save ? (
                <p>
                    <strong>Saving Throws</strong>
                    <span>
                        {' '}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: Object.keys(data.save ?? {})
                                    .map(
                                        (key) =>
                                            `${titleCase(key)} ${renderToString(
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: mapDiceExpression(
                                                            data.save[key],
                                                            '1d20' + data.save[key]
                                                        ),
                                                    }}
                                                />
                                            )}`
                                    )
                                    .join(', '),
                            }}
                        />
                    </span>
                </p>
            ) : null}
            {data.skill ? (
                <p>
                    <strong>Skills</strong>
                    <span>
                        {' '}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: Object.keys(data.skill ?? {})
                                    .map(
                                        (key) =>
                                            `${titleCase(key)} ${renderToString(
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: mapDiceExpression(
                                                            data.skill[key],
                                                            '1d20' + data.skill[key]
                                                        ),
                                                    }}
                                                />
                                            )}`
                                    )
                                    .join(', '),
                            }}
                        />
                    </span>
                </p>
            ) : null}
            {data.resist ? (
                <p>
                    <strong>Damage Resistances</strong>
                    <span> {mapResistancesAndInmunities(data.resist, 'resist')}</span>
                </p>
            ) : null}
            {data.immune ? (
                <p>
                    <strong>Damage Inmunities</strong>
                    <span> {mapResistancesAndInmunities(data.immune, 'immune')}</span>
                </p>
            ) : null}
            {data.conditionImmune ? (
                <p>
                    <strong>Condition Inmunities</strong>{' '}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: data.conditionImmune.map((condition: string) => mapCondition(condition)).join(', '),
                        }}
                    />
                </p>
            ) : null}
            <p>
                <strong>Senses</strong>
                <span>
                    {' '}
                    {data.senses ? data.senses.join(', ') : ''}
                    {data.senses ? ',' : ''} passive Perception {data.passive}
                </span>
            </p>
            <p>
                <strong>Language</strong>
                <span> {data.languages?.join(', ') ?? '-'}</span>
            </p>
            <p>
                <strong>Challenge</strong>
                <span>
                    {' '}
                    {typeof data.cr === 'string' ? (
                        <>
                            {data.cr} ({PROPS_MAPPING.xpPerCR[data.cr]} XP)
                        </>
                    ) : (
                        <>
                            {data.cr.cr} ({PROPS_MAPPING.xpPerCR[data.cr.cr]} XP)
                            {data.cr.lair
                                ? ` or ${data.cr.lair} (${
                                      PROPS_MAPPING.xpPerCR[data.cr.lair]
                                  } XP) when encountered in lair`
                                : ''}
                        </>
                    )}
                </span>
            </p>
            <p>
                <strong>Proficiency Bonus</strong>
                <span> {data.pbNote ? data.pbNote : PROPS_MAPPING.proficiencyBonus[data.cr?.cr ?? data.cr]}</span>
            </p>
            <hr />
            {data.trait ? data.trait.map((trait: any) => renderActionOrTrait(trait, 'trait')) : null}
            {data.spellcasting
                ? data.spellcasting.map((spellcasting: any) => (
                      <div key={`${data.name}_spellcasting_${spellcasting.name}`}>
                          <strong>{spellcasting.name}. </strong>
                          <span
                              dangerouslySetInnerHTML={{
                                  __html: map5eToolsReferences(spellcasting.headerEntries.join(' ')),
                              }}
                          />
                          {spellcasting.will ? (
                              <p>
                                  <i>At will: </i>
                                  <span
                                      dangerouslySetInnerHTML={{
                                          __html: spellcasting.will
                                              .map((spell: string) => map5eToolsReference(spell))
                                              .join(', '),
                                      }}
                                  />
                              </p>
                          ) : null}
                          {spellcasting.daily
                              ? Object.keys(spellcasting.daily).map((timesPerDay: string) => {
                                    const isEach = timesPerDay.endsWith('e');
                                    const times = timesPerDay.replace('e', '');
                                    return (
                                        <p key={`${data.name}_dailySpellcasting_${timesPerDay}`}>
                                            <i>
                                                {times}/day{isEach ? ' each' : ''}:{' '}
                                            </i>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: spellcasting.daily[timesPerDay]
                                                        .map((spell: string) => map5eToolsReference(spell))
                                                        .join(', '),
                                                }}
                                            />
                                        </p>
                                    );
                                })
                              : null}
                          {spellcasting.spells
                              ? Object.keys(spellcasting.spells).map((spellSource: string) => {
                                    const spellData = spellcasting.spells[spellSource];
                                    const nameMapping: any = {
                                        0: 'Cantrips (at will)',
                                        1: `1st level (${spellData.slots} slots)`,
                                        2: `2nd level (${spellData.slots} slots)`,
                                        3: `3rd level (${spellData.slots} slots)`,
                                        4: `4th level (${spellData.slots} slots)`,
                                        5: `5th level (${spellData.slots} slots)`,
                                        6: `6th level (${spellData.slots} slots)`,
                                        7: `7th level (${spellData.slots} slots)`,
                                        8: `8th level (${spellData.slots} slots)`,
                                        9: `9th level (${spellData.slots} slots)`,
                                    };
                                    return (
                                        <p key={`${data.name}_spellSlotLevel_${spellSource}`}>
                                            <i>{nameMapping[spellSource]}: </i>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: spellData.spells
                                                        .map((spell: string) => map5eToolsReference(spell))
                                                        .join(', '),
                                                }}
                                            />
                                        </p>
                                    );
                                })
                              : null}
                      </div>
                  ))
                : null}
            {data.action ? (
                <>
                    <h3>Actions</h3>
                    {data.action.map((x: any) => renderActionOrTrait(x, 'action'))}
                </>
            ) : null}
            {data.bonus ? (
                <>
                    <h3>Bonus Actions</h3>
                    {data.bonus.map((x: any) => renderActionOrTrait(x, 'bonus'))}
                </>
            ) : null}
            {data.reaction ? (
                <>
                    <h3>Reactions</h3>
                    {data.reaction.map((x: any) => renderActionOrTrait(x, 'reaction'))}
                </>
            ) : null}
            {data.legendary ? (
                <>
                    <h3>Legendary Actions</h3>
                    <span>
                        {data.isNamedCreature ? data.name : `The ${data.name.toLowerCase()}`} can take{' '}
                        {data.legendaryActions ?? PROPS_MAPPING.defaultLegendaryActions} legendary actions, choosing
                        from the options below. Only one legendary action can be used at a time and only at the end of
                        another creature's turn. The lich regains spent legendary actions at the start of its turn.
                    </span>
                    {data.legendary.map((x: any) => renderActionOrTrait(x, 'legendary'))}
                </>
            ) : null}
            {data.environment ? (
                <p>
                    <strong>Environment: </strong>
                    <span> {data.environment.map((env: string) => titleCase(env)).join(', ')}</span>
                </p>
            ) : null}
            {data.legendaryGroup ? (
                <>
                    <h3>Lair Actions</h3>
                    <p>See lair actions from {data.legendaryGroup.name}'s legendary group</p>
                </>
            ) : null}
        </div>
    );
};
