import '../styles/CharacterStatBlock.css';
import React from 'react';

export function CharacterStatBlock({ character }) {
    const get_senses = () => {
        const passive_perception = 10 + character.skills.find((x) => x.name === 'Percepción').modifier;
        return `Percepción pasiva ${passive_perception}`;
    };

    return (
        <div className="CharacterStatBlock">
            <h1>
                <a href={`https://nivel20.com/games/dnd-5/characters/${character.character_id}`}>{character.name}</a>
            </h1>
            <div>
                <i>
                    {character.class} {character.race}, {character.alignment}
                </i>
            </div>
            <div className="divider"></div>
            <div>
                <b>Clase de armadura </b>
                <span>{character.armor_class}</span>
            </div>
            <div>
                <b>Puntos de golpe </b>
                <span>{character.max_hp}</span>
            </div>
            <div>
                <b>Velocidad </b>
                <span>{character.speed} pies</span>
            </div>
            <div>
                <b>Bono de competencia </b>
                <span>+{character.proficiency_bonus}</span>
            </div>
            <table>
                <tbody>
                    <tr>
                        {character.ability_scores.map((ability_score) => (
                            <th key={`${character.name}_${ability_score.name}_title`}>
                                <b>{ability_score.name.toUpperCase().substring(0, 3)}</b>
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {character.ability_scores.map((ability_score) => (
                            <td key={`${character.name}_${ability_score.name}_score`}>
                                {ability_score.value} ({ability_score.modifier >= 0 ? '+' : ''}
                                {ability_score.modifier})
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div>
                <b>Tiradas de salvación </b>{' '}
                <span>
                    {character.saving_throws
                        .filter((saving_throw) => saving_throw.has_proficiency)
                        .map(
                            (saving_throw) =>
                                `${saving_throw.name} ${saving_throw.modifier >= 0 ? '+' : ''}${saving_throw.modifier}`
                        )
                        .join(', ')}
                </span>
            </div>
            <div>
                <b>Habilidades con competencia </b>{' '}
                <span>
                    {character.skills
                        .filter((skill) => skill.has_proficiency)
                        .map((skill) => `${skill.name} ${skill.modifier >= 0 ? '+' : ''}${skill.modifier}`)
                        .join(', ')}
                </span>
            </div>
            <div>
                <b>Sentidos </b> <span>{get_senses()}</span>
            </div>
            <div>
                <b>Idiomas </b> <span>{character.languages}</span>
            </div>
            {character.spellcasting === null ? (
                <></>
            ) : (
                <>
                    <div className="divider"></div>
                    <div>
                        <b>Lanzamiento de conjuros </b>
                        La habilidad de lanzamiento de conjuros de {character.name} es{' '}
                        {character.spellcasting.spellcasting_ability} (CD de salvación de conjuros{' '}
                        {character.spellcasting.saving_throws_cd}, {character.spellcasting.attack_bonus >= 0 ? '+' : ''}
                        {character.spellcasting.attack_bonus} para golpear con ataques de conjuro). {character.name}{' '}
                        tiene acceso a los siguientes conjuros:
                        {Object.keys(character.spellcasting.spell_levels)
                            .map((k) => parseInt(k))
                            .map((spell_level) =>
                                character.spellcasting.spell_levels[spell_level].max_spell_slots === 0 ? null : (
                                    <div key={`${character.name}_spell_level_${spell_level}`}>
                                        <i>
                                            {spell_level === 0
                                                ? 'Trucos (a voluntad)'
                                                : `Nivel ${spell_level} (${character.spellcasting.spell_levels[spell_level].max_spell_slots} espacios): `}
                                        </i>
                                        {character.spellcasting.spell_levels[spell_level].spells.join(', ')}
                                    </div>
                                )
                            )}
                    </div>
                </>
            )}
        </div>
    );
}
