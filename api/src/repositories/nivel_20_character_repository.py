from datetime import timedelta, datetime
from typing import List, Optional
import re
import bs4
import requests

from bs4 import BeautifulSoup
from cachetools import TTLCache


class Nivel20CharacterRepository:
    _MAX_SPELL_LEVEL = 9
    _ABILITY_SCORES_FULL_NAMES = {
        'Fue': 'Fuerza',
        'Des': 'Destreza',
        'Con': 'Constitución',
        'Int': 'Inteligencia',
        'Sab': 'Sabiduría',
        'Car': 'Carisma'
    }

    _TTL_CACHE_MINUTES = 5
    _cache = None

    def __init__(self) -> None:
        self._base_url = 'https://nivel20.com/games/dnd-5/characters/'
        if Nivel20CharacterRepository._cache is None:
            Nivel20CharacterRepository._cache = TTLCache(maxsize=10_000, ttl=timedelta(
                minutes=Nivel20CharacterRepository._TTL_CACHE_MINUTES), timer=datetime.now)

    def _get_player_ability_scores(self, soup: BeautifulSoup) -> List[dict]:
        characteristics = []
        for x in soup.find('div', attrs={
            'class': 'ability-grid'
        }).children:
            if not isinstance(x, bs4.element.Tag):
                continue
            characteristics.append({
                'name': self._ABILITY_SCORES_FULL_NAMES[x.find('div', attrs={
                    'class': 'name text-muted'
                }).string],
                'value': int(x.find('div', attrs={
                    'class': 'value ml-auto mr-auto'
                }).string),
                'modifier': int(x.find('span').string)
            })
        return characteristics

    @classmethod
    def _get_skills(cls, soup: BeautifulSoup) -> List[dict]:
        skill_possible_row = soup.find('div', attrs={
            'id': 'skillsAccordion'
        }).find('div', attrs={
            'class': 'values-table'
        }).find_all('a', attrs={
            'class': 'custom-value-link',
            'data-modal': True
        })
        skills = []
        for row in skill_possible_row:
            skill_name = row.find('div', attrs={
                'class': 'table-cell col-xs-9'
            }).contents[2].strip()
            has_proficiency = 'fa-circle-o' not in row.find('i', attrs={
                'class': 'fa'
            }).attrs['class']
            modifier = int(row.find('div', attrs={
                'class': 'numeric-val'
            }).find('span').string)
            skills.append({
                'name': re.sub(r' \(.+\)', '', skill_name),
                'has_proficiency': has_proficiency,
                'modifier': modifier
            })
        return skills

    @classmethod
    def _get_saving_throws(cls, soup: BeautifulSoup) -> List[dict]:
        saving_throws = []
        saving_throw_rows = soup.find('span', string='Tiradas de salvación').parent.parent.parent.find('div', attrs={
            'class': 'values-table'
        }).find_all('div', attrs={
            'class': 'table-row'
        })
        for row in saving_throw_rows:
            ability_name = row.find('a', attrs={
                'class': 'custom-value-link'
            }).contents[1].strip()
            has_proficiency = 'fa-circle-o' not in row.find('i', attrs={
                'class': 'fa'
            }).attrs['class']
            modifier = int(row.find('span').string)
            saving_throws.append({
                'name': re.sub(r' \(.+\)', '', ability_name),
                'has_proficiency': has_proficiency,
                'modifier': modifier
            })
        return saving_throws

    @classmethod
    def _get_name(cls, soup: BeautifulSoup) -> str:
        return soup.find('div', attrs={
            'class': 'character-desc'
        }).find('h4').find('strong').string

    @classmethod
    def _get_race(cls, soup: BeautifulSoup) -> str:
        return soup.find('div', attrs={
            'class': 'character-desc'
        }).find('a', attrs={
            'class': 'custom-value-link'
        }).find('span').string

    @classmethod
    def _get_class(cls, soup: BeautifulSoup) -> str:
        return str(soup.find('div', attrs={
            'class': 'character-desc'
        }).find('div').contents[2]).strip()

    @classmethod
    def _get_max_hit_points(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='de golpe').previous_sibling.previous_sibling.string)

    @classmethod
    def _get_speed(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='Velocidad').next_sibling.next_sibling.string)

    @classmethod
    def _get_armor_class(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='Clase de').next_sibling.next_sibling.string)

    @classmethod
    def _get_proficiency_bonus(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='Competencia').previous_sibling.previous_sibling.string)

    @classmethod
    def _get_alignment(cls, soup: BeautifulSoup) -> str:
        return soup.find('strong', string='Alineamiento').next_sibling.strip().replace('. ', '')

    @classmethod
    def _get_languages(cls, soup: BeautifulSoup) -> str:
        return soup.find('strong', string='Idiomas').next_sibling.strip().replace('. ', '')

    @classmethod
    def _get_spellcasting_ability(cls, soup: BeautifulSoup) -> str:
        return soup.find('div', string='Característica mágica').next_sibling.next_sibling.string

    @classmethod
    def _get_spells_saving_throws_cd(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='CD Salvación').next_sibling.next_sibling.string)

    @classmethod
    def _get_spells_attack_bonus(cls, soup: BeautifulSoup) -> int:
        return int(soup.find('div', string='Bonif. ataque').next_sibling.next_sibling.string)

    @classmethod
    def _get_max_spell_slots(cls, max_spells_slots: List[str], spell_level: int) -> int:
        if max_spells_slots[spell_level - 1] == '-':
            return 0
        return int(max_spells_slots[spell_level - 1])

    @classmethod
    def _get_spells_by_level(cls, soup: BeautifulSoup, spell_level: int) -> List[str]:
        spells_blocks = [y for x in soup.find_all('div', attrs={
            'class': 'spell-level-list'
        }) for y in x.contents if isinstance(y, bs4.element.Tag)]
        spells = []
        for spell_block in spells_blocks:
            spell_attrs = [x for x in spell_block.find_all('div', attrs={
                'class': 'row'
            })[0].contents if isinstance(x, bs4.element.Tag)]
            is_cantrip = spell_attrs[0].string == 'Truco'
            if (spell_level == 0 and is_cantrip) or (
                    not is_cantrip and str(spell_level) == spell_attrs[0].string.replace('Nv. ', '')):
                spells.append(spell_attrs[1].find('strong').string)
        return spells

    def _get_spells_levels_and_spells(self, soup: BeautifulSoup) -> dict:
        spells_info = dict()
        max_spells_slots = [x.parent.previous_sibling.previous_sibling.string for x in
                            soup.find('div', string='Espacios de conjuro por nivel').parent.find_all('span',
                                                                                                     string='Nivel')]
        for spell_level in range(self._MAX_SPELL_LEVEL + 1):
            spells_info[spell_level] = {
                'max_spell_slots': 0 if spell_level == 0 else self._get_max_spell_slots(max_spells_slots, spell_level),
                'spells': self._get_spells_by_level(soup, spell_level)
            }
        return spells_info

    def _get_spellcasting_info(self, soup: BeautifulSoup) -> Optional[dict]:
        # If character has no spells
        if not soup.find('a', attrs={
            'href': '#panel-magic'
        }):
            return None
        return {
            'spellcasting_ability': self._get_spellcasting_ability(soup),
            'saving_throws_cd': self._get_spells_saving_throws_cd(soup),
            'attack_bonus': self._get_spells_attack_bonus(soup),
            'spell_levels': self._get_spells_levels_and_spells(soup)
        }

    def _format_character_data(self, character_id: str, soup: BeautifulSoup) -> dict:
        character = {
            'character_id': character_id,
            'name': self._get_name(soup),
            'race': self._get_race(soup),
            'class': self._get_class(soup),
            'ability_scores': self._get_player_ability_scores(soup),
            'skills': self._get_skills(soup),
            'max_hp': self._get_max_hit_points(soup),
            'speed': self._get_speed(soup),
            'armor_class': self._get_armor_class(soup),
            'proficiency_bonus': self._get_proficiency_bonus(soup),
            'saving_throws': self._get_saving_throws(soup),
            'alignment': self._get_alignment(soup),
            'languages': self._get_languages(soup),
            'spellcasting': self._get_spellcasting_info(soup)
        }
        return character

    def _get_character_html(self, character_id: str) -> str:
        response = requests.get(f'{self._base_url}{character_id}')
        return response.content.decode('utf-8')

    def get_character(self, character_id: str) -> dict:
        if character_id not in Nivel20CharacterRepository._cache:
            html = self._get_character_html(character_id)
            soup = BeautifulSoup(html, 'html5lib')
            Nivel20CharacterRepository._cache[character_id] = self._format_character_data(character_id, soup)
        return Nivel20CharacterRepository._cache[character_id]
