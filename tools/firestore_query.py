#!/usr/bin/env python3
"""
firestore_query.py — Testa diferentes nomes de coleções via runQuery
Usa apenas stdlib do Python — sem dependências externas.
SOMENTE LEITURA.
"""
import json
import urllib.request
import urllib.error
from pathlib import Path

FIREBASE_API_KEY    = "AIzaSyAWXNN5ivFcNYVsSyPY_IddqdTJsh7cAJI"
FIREBASE_PROJECT_ID = "xcore-f2521"
ADMIN_EMAIL         = "admin@kentricos.com"
ADMIN_PASSWORD      = "adminkentricos"
AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
QUERY_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery"


def get_token():
    body = json.dumps({
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "returnSecureToken": True,
    }).encode()
    req = urllib.request.Request(AUTH_URL, body, {"Content-Type": "application/json"})
    resp = json.loads(urllib.request.urlopen(req).read())
    return resp["idToken"]


def run_query(collection, token):
    query = {
        "structuredQuery": {
            "from": [{"collectionId": collection}],
            "limit": 5,
        }
    }
    body = json.dumps(query).encode()
    req = urllib.request.Request(QUERY_URL, body, {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    })
    try:
        return json.loads(urllib.request.urlopen(req).read())
    except urllib.error.HTTPError as e:
        return [{"error": f"HTTP {e.code}: {e.read().decode()[:300]}"}]


def main():
    print("[OK] Autenticando...")
    token = get_token()
    print("[OK] Token obtido\n")

    collections_to_try = [
        "resultado", "resultados", "assessments", "responses",
        "users", "submissions", "leads", "empresas", "respostas",
        "xcore", "assessment", "avaliacoes",
    ]

    found = {}
    for col in collections_to_try:
        result = run_query(col, token)
        docs = [r for r in result if isinstance(r, dict) and "document" in r]
        if docs:
            found[col] = docs
            print(f"[FOUND] {col}: {len(docs)} doc(s)")
        elif isinstance(result, list) and len(result) > 0:
            first = result[0]
            if isinstance(first, dict) and "error" in first:
                print(f"[ERROR] {col}: {first['error'][:100]}")
            else:
                print(f"[EMPTY] {col}: sem docs (first item keys: {list(first.keys()) if isinstance(first, dict) else type(first)})")
        else:
            print(f"[EMPTY] {col}")

    print()

    if found:
        for col, docs in found.items():
            print(f"\n=== COLECAO: {col} ===")
            first_doc = docs[0].get("document", {})
            fields = first_doc.get("fields", {})
            print(f"Doc ID: {first_doc.get('name', '').split('/')[-1]}")
            print("Campos:")
            all_fields = {}
            for doc_result in docs:
                doc = doc_result.get("document", {})
                for k, v in doc.get("fields", {}).items():
                    vtype = list(v.keys())[0]
                    vval = str(list(v.values())[0])[:100]
                    all_fields[k] = vtype
                    if k in fields:  # print from first doc
                        print(f"  {k}: [{vtype}] = {vval}")

            print(f"\nTodos os campos encontrados:")
            for k, t in sorted(all_fields.items()):
                print(f"  {k}: {t}")

        Path(".tmp").mkdir(exist_ok=True)
        with open(".tmp/schema_raw.json", "w", encoding="utf-8") as f:
            json.dump({"found_collections": found}, f, ensure_ascii=False, indent=2, default=str)
        print("\n[OK] Schema salvo em .tmp/schema_raw.json")
    else:
        print("Nenhuma colecao encontrada com dados.")
        # Debug: show raw response for 'resultado'
        print("\n[DEBUG] Resposta bruta para 'resultado':")
        result = run_query("resultado", token)
        print(json.dumps(result, indent=2, default=str)[:1000])


if __name__ == "__main__":
    main()
