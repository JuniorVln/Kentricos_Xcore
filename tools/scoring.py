import json
import os
from datetime import datetime

# Path to config - adjusting for relative path assuming script is in /tools
CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', 'scoring_config.json')

def load_config():
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Config not found at {CONFIG_PATH}")
        return None

def normalize_string(s):
    return s.lower().strip() if s else ""

def check_match(value, target_list):
    if not value: return False
    norm_value = normalize_string(value)
    return any(normalize_string(t) in norm_value for t in target_list)

def calculate_score(lead, config):
    # Base score parts
    score_cargo = 0
    score_pontuacao = float(lead.get('pontuacaoTotalFinal', 0) or 0) # 0-100

    # Cargo Logic
    cargo = lead.get('cargo', '') # Assuming 'cargo' field exists or inferred
    # In mock data, cargo might be missing or part of 'empresa' contacts. 
    # For this script, we assume a flat structure or adapt.
    
    if check_match(cargo, config['cargos_alto_potencial']['hot']):
        score_cargo = 100
    elif check_match(cargo, config['cargos_alto_potencial']['warm']):
        score_cargo = 50
    else:
        score_cargo = 0

    # Weighted Combination
    weights = config['regra_combinada']
    final_score = (score_cargo * weights['peso_cargo']) + (score_pontuacao * weights['peso_pontuacao'])
    
    return round(final_score, 1)

def determine_status(score, config):
    ranges = config['faixas_pontuacao']
    if score >= ranges['hot']['min']: return 'HOT'
    if score >= ranges['warm']['min']: return 'WARM'
    return 'COLD'

def process_leads(leads_data):
    config = load_config()
    if not config: return []

    processed = []
    for lead in leads_data:
        score = calculate_score(lead, config)
        status = determine_status(score, config)
        
        lead_copy = lead.copy()
        lead_copy['_score'] = score
        lead_copy['_flag'] = status
        processed.append(lead_copy)
    
    # Sort by score desc
    return sorted(processed, key=lambda x: x['_score'], reverse=True)

# Mock execution since we don't have Firestore here
if __name__ == "__main__":
    print("Scoring Tool Loaded.")
    print("To run with Firestore: implement firebase_admin connection.")
    # In a real scenario, this would fetch from Firestore, process, and serve via Flask/FastAPI
