#!/usr/bin/env python3
"""
firestore_introspect_rest.py — Introspecção via Firebase REST API
B.L.A.S.T. Protocol — Phase 2: Link (Fallback sem service account)

Usa Firebase Auth REST API para autenticar com email/senha,
depois acessa Firestore REST API para listar coleções.

REGRA ABSOLUTA: SOMENTE LEITURA — Nenhuma escrita, update ou delete.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import urllib.request
import urllib.error

# ─── Configuração ─────────────────────────────────────────────────────────────
FIREBASE_API_KEY    = "AIzaSyAWXNN5ivFcNYVsSyPY_IddqdTJsh7cAJI"
FIREBASE_PROJECT_ID = "xcore-f2521"
ADMIN_EMAIL         = "admin@kentricos.com"
ADMIN_PASSWORD      = "adminkentricos"
SAMPLE_DOCS         = 5
OUTPUT_FILE         = Path(".tmp/schema_raw.json")

FIREBASE_AUTH_URL   = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
FIRESTORE_BASE_URL  = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents"


def http_post(url: str, data: dict) -> dict:
    """POST JSON simples via urllib."""
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, body, {"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def http_get(url: str, token: str) -> dict:
    """GET autenticado via urllib."""
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def firestore_value_to_python(value: dict) -> Any:
    """Converte valor Firestore REST (typed) para Python nativo."""
    if "stringValue"    in value: return value["stringValue"]
    if "integerValue"   in value: return int(value["integerValue"])
    if "doubleValue"    in value: return float(value["doubleValue"])
    if "booleanValue"   in value: return value["booleanValue"]
    if "nullValue"      in value: return None
    if "timestampValue" in value: return value["timestampValue"]
    if "mapValue"       in value:
        return {k: firestore_value_to_python(v)
                for k, v in value["mapValue"].get("fields", {}).items()}
    if "arrayValue"     in value:
        return [firestore_value_to_python(i)
                for i in value["arrayValue"].get("values", [])]
    if "referenceValue" in value: return f"REF:{value['referenceValue']}"
    if "geoPointValue"  in value: return f"GEO:{value['geoPointValue']}"
    return str(value)


def detect_type(value: Any) -> str:
    if value is None:          return "null"
    if isinstance(value, bool): return "boolean"
    if isinstance(value, int):  return "integer"
    if isinstance(value, float): return "float"
    if isinstance(value, str):
        if value.startswith("REF:"): return "reference"
        if value.startswith("GEO:"): return "geopoint"
        return "string"
    if isinstance(value, dict): return "map"
    if isinstance(value, list): return "array"
    return type(value).__name__


def get_token() -> str:
    """Autentica com Firebase e retorna idToken."""
    print(f"  🔑 Autenticando como: {ADMIN_EMAIL}")
    resp = http_post(FIREBASE_AUTH_URL, {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "returnSecureToken": True,
    })
    token = resp.get("idToken")
    if not token:
        raise RuntimeError(f"Falha na autenticação: {resp}")
    print("  ✅ Token obtido com sucesso")
    return token


def list_collections(token: str) -> list[str]:
    """Lista coleções de nível raiz via :listCollectionIds."""
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents:listCollectionIds"
    req = urllib.request.Request(
        url,
        data=b"{}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
    return data.get("collectionIds", [])


def sample_collection(col_name: str, token: str) -> dict:
    """Busca até SAMPLE_DOCS documentos de uma coleção e mapeia campos."""
    url = f"{FIRESTORE_BASE_URL}/{col_name}?pageSize={SAMPLE_DOCS}"
    result = {
        "document_count_sampled": 0,
        "fields": {},
        "sample_docs": [],
        "subcollections": {},
    }
    try:
        data = http_get(url, token)
        docs = data.get("documents", [])
        result["document_count_sampled"] = len(docs)

        for doc in docs:
            doc_id = doc["name"].split("/")[-1]
            raw_fields = doc.get("fields", {})
            parsed = {k: firestore_value_to_python(v) for k, v in raw_fields.items()}

            # Agregar campos únicos
            for field_name, field_value in parsed.items():
                if field_name not in result["fields"]:
                    result["fields"][field_name] = {
                        "type": detect_type(field_value),
                        "nullable": field_value is None,
                    }
                elif field_value is None:
                    result["fields"][field_name]["nullable"] = True

            result["sample_docs"].append({
                "id": doc_id,
                "fields": {k: {"type": detect_type(v), "sample_value": str(v)[:200]}
                           for k, v in parsed.items()},
            })

    except urllib.error.HTTPError as e:
        result["error"] = f"HTTP {e.code}: {e.reason}"
    except Exception as e:
        result["error"] = str(e)

    return result


def main():
    print("=" * 65)
    print("🔍 XCore — Introspecção do Firestore (REST API)")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Projeto: {FIREBASE_PROJECT_ID}")
    print("⛔ MODO SOMENTE LEITURA — Nenhuma escrita será executada")
    print("=" * 65)

    # ─── Autenticar ───────────────────────────────────────────────────────────
    print("\n1️⃣  Autenticando no Firebase...")
    try:
        token = get_token()
    except Exception as e:
        print(f"\n❌ Falha na autenticação: {e}")
        sys.exit(1)

    # ─── Listar coleções ──────────────────────────────────────────────────────
    print("\n2️⃣  Listando coleções de nível raiz...")
    try:
        collections = list_collections(token)
    except Exception as e:
        print(f"\n❌ Falha ao listar coleções: {e}")
        sys.exit(1)

    if not collections:
        print("⚠️  Nenhuma coleção encontrada!")
        sys.exit(0)

    print(f"✅ {len(collections)} coleção(ões) encontrada(s): {collections}\n")

    # ─── Introspectar cada coleção ────────────────────────────────────────────
    print("3️⃣  Introspeccionando coleções...")
    schema = {
        "_metadata": {
            "introspected_at": datetime.now().isoformat(),
            "tool": "firestore_introspect_rest.py",
            "mode": "READ_ONLY",
            "project_id": FIREBASE_PROJECT_ID,
            "samples_per_collection": SAMPLE_DOCS,
        },
        "collections": {},
    }

    for col_name in collections:
        print(f"\n  📁 {col_name}")
        schema["collections"][col_name] = sample_collection(col_name, token)
        d = schema["collections"][col_name]
        print(f"     Docs amostrados: {d['document_count_sampled']}")
        print(f"     Campos: {list(d['fields'].keys())}")
        if d.get("error"):
            print(f"     ⚠️  Erro: {d['error']}")

    # ─── Salvar output ────────────────────────────────────────────────────────
    OUTPUT_FILE.parent.mkdir(exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(schema, f, ensure_ascii=False, indent=2, default=str)

    # ─── Resumo final ─────────────────────────────────────────────────────────
    print("\n" + "=" * 65)
    print("📊 RESUMO DO SCHEMA:")
    print("=" * 65)
    for col_name, col_data in schema["collections"].items():
        print(f"\n🗂️  {col_name}")
        print(f"   Docs amostrados: {col_data['document_count_sampled']}")
        if col_data.get("fields"):
            for fn, fi in col_data["fields"].items():
                n = " (nullable)" if fi.get("nullable") else ""
                print(f"     • {fn}: {fi['type']}{n}")
        if col_data.get("error"):
            print(f"   ⚠️  Erro: {col_data['error']}")

    print(f"\n✅ Schema salvo em: {OUTPUT_FILE}")
    print("📌 PRÓXIMO PASSO: Revisar schema e atualizar gemini.md")
    print("=" * 65)


if __name__ == "__main__":
    main()
