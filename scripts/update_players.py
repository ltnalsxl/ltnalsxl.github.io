#!/usr/bin/env python3
"""Add English player names using a mapping file."""

import argparse
import json
from pathlib import Path


def load_mapping(path: Path) -> dict:
    with path.open(encoding='utf-8') as f:
        data = json.load(f)
    return {item['ko']: item['en'] for item in data}


def update_players(players_path: Path, mapping: dict) -> list:
    with players_path.open(encoding='utf-8') as f:
        players = json.load(f)
    for player in players:
        ko_name = player.get('name_ko') or player.get('ko') or player.get('name')
        if ko_name and ko_name in mapping:
            player['name_en'] = mapping[ko_name]
    return players


def main() -> None:
    parser = argparse.ArgumentParser(description='Add English names to player JSON using mapping file.')
    parser.add_argument('players', type=Path, help='Input players JSON file')
    parser.add_argument('-m', '--mapping', type=Path, default=Path('_data/player_name_map.json'),
                        help='Path to name mapping JSON')
    parser.add_argument('-o', '--output', type=Path,
                        help='Output file path (default: overwrite input)')
    args = parser.parse_args()

    mapping = load_mapping(args.mapping)
    updated = update_players(args.players, mapping)
    out_path = args.output or args.players
    with out_path.open('w', encoding='utf-8') as f:
        json.dump(updated, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
