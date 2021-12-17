from typing import List
from os import EX_TEMPFAIL
import requests
import json
import bs4
from bs4 import BeautifulSoup

URL = 'https://nivel20.com/games/dnd-5/characters/257765-donafreddo'


def get_player_characteristics(soup: BeautifulSoup) -> List[dict]:
    characteristics = []
    for x in soup.find('div', attrs={'class': 'ability-grid'}).children:
        if not isinstance(x, bs4.element.Tag):
            continue
        characteristics.append({
            'name': x.find('div', attrs={'class': 'name text-muted'}).string,
            'value': int(x.find('div', attrs={'class': 'value ml-auto mr-auto'}).string),
            'modifier': int(x.find('span').string)
        })
    return characteristics

def get_player_habilities(soup: BeautifulSoup) -> dict:
    return {

    }

def process_data(data: str) -> dict:
    soup = BeautifulSoup(data, 'html5lib')
    character = {
        'name': soup.find('div', attrs={'class': 'character-desc'}).find('h4').find('strong').string,
        'race': soup.find('div', attrs={'class': 'character-desc'}).find('a', attrs={'class': 'custom-value-link'}).find('span').string,
        'class': soup.find('div', attrs={'class': 'character-desc'}).find('div').contents[2].strip(),
        'characteristics':get_player_characteristics(soup),
        'habilities': get_player_habilities(soup)
    }
    return character

def fetch_character() -> str:
    response = requests.get(URL)
    return response.content.decode('utf-8')


def save_processed(character_dict: dict) -> None:
    with open('character_output.json', 'w') as f:
        f.flush()
        f.seek(0)
        f.write(json.dumps(character_dict, indent=2))


def main() -> None:
    fetched_data = fetch_character()
    character = process_data(fetched_data)
    save_processed(character)


if __name__ == '__main__':
    main()
