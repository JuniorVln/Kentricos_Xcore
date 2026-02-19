#!/usr/bin/env python3
"""
firestore_introspect.py — Camada 3: Ferramenta de Introspecção do Firestore
B.L.A.S.T. Protocol — Phase 2: Link

REGRA ABSOLUTA: Este script é SOMENTE LEITURA.
Nenhuma operação de escrita, update ou delete é executada.

Saída: .tmp/schema_raw.json com estrutura de todas as coleções.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# ─── Configuração ─────────────────────────────────────────────────────────────
load_dotenv()

SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./service-account.json")
SAMPLE_DOCS_PER_COLLECTION = 5
OUTPUT_FILE = Path(".tmp/schema_raw.json")


def detect_type(value: Any) -> str:
    """Mapeia valores Python para nomes de tipo legíveis."""
    if value is None:
        return "null"
    elif isinstance(value, bool):
        return "boolean"
    elif isinstance(value, int):
        return "integer"
    elif isinstance(value, float):
        return "float"
    elif isinstance(value, str):
        return "string"
    elif isinstance(value, datetime):
        return "timestamp"
    elif isinstance(value, dict):
        return "map"
    elif isinstance(value, list):
        return "array"
    else:
        return type(value).__name__


def sample_document(doc_data: dict) -> dict:
    """Cria uma amostra do documento com tipos e valores truncados."""
    sample = {}
    for key, value in doc_data.items():
        sample[key] = {
            "type": detect_type(value),
            "sample_value": str(value)[:200] if value is not None else None,
        }
    return sample


def introspect_collection(db, collection_ref, depth: int = 0) -> dict:
    """Introspecta uma coleção: lista docs, mapeia campos, detecta subcoleções."""
    result = {
        "document_count_sampled": 0,
        "fields": {},
        "sample_docs": [],
        "subcollections": {},
    }

    try:
        # Buscar amostra de documentos (sem carregar coleção inteira)
        docs = list(collection_ref.limit(SAMPLE_DOCS_PER_COLLECTION).stream())
        result["document_count_sampled"] = len(docs)

        for doc in docs:
            doc_data = doc.to_dict()
            if not doc_data:
                continue

            # Agregar campos únicos com seus tipos
            for field_name, field_value in doc_data.items():
                if field_name not in result["fields"]:
                    result["fields"][field_name] = {
                        "type": detect_type(field_value),
                        "nullable": field_value is None,
                    }
                elif field_value is None:
                    result["fields"][field_name]["nullable"] = True

            # Adicionar documento de amostra
            result["sample_docs"].append({
                "id": doc.id,
                "fields": sample_document(doc_data),
            })

            # Verificar subcoleções (apenas no primeiro nível)
            if depth == 0:
                try:
                    subcols = list(doc.reference.collections())
                    for subcol in subcols:
                        subcol_name = subcol.id
                        if subcol_name not in result["subcollections"]:
                            print(f"    📂 Subcoleção encontrada: {subcol_name}")
                            result["subcollections"][subcol_name] = introspect_collection(
                                db, subcol, depth=depth + 1
                            )
                except Exception as e:
                    print(f"    ⚠️ Erro ao listar subcoleções: {e}")

    except Exception as e:
        result["error"] = str(e)
        print(f"  ❌ Erro ao introspectar: {e}")

    return result


def main():
    print("=" * 60)
    print("🔍 XCore — Introspecção do Firestore")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("⛔ MODO SOMENTE LEITURA — Nenhuma escrita será executada")
    print("=" * 60)

    # ─── Verificar credenciais ─────────────────────────────────────────────────
    if not Path(SERVICE_ACCOUNT_PATH).exists():
        print(f"\n❌ ERRO: Arquivo de service account não encontrado em: {SERVICE_ACCOUNT_PATH}")
        print("📋 Passos necessários:")
        print("  1. Abrir Firebase Console → Project Settings → Service Accounts")
        print("  2. Clicar em 'Generate new private key'")
        print(f"  3. Salvar o arquivo JSON como: {SERVICE_ACCOUNT_PATH}")
        sys.exit(1)

    # ─── Inicializar Firebase Admin ────────────────────────────────────────────
    print(f"\n🔑 Carregando credenciais de: {SERVICE_ACCOUNT_PATH}")
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase Admin SDK inicializado com sucesso")
    except Exception as e:
        print(f"❌ Falha ao inicializar Firebase: {e}")
        sys.exit(1)

    # ─── Listar e introspectar coleções ───────────────────────────────────────
    print("\n📋 Listando coleções de nível raiz...")
    try:
        collections = list(db.collections())
    except Exception as e:
        print(f"❌ Falha ao listar coleções: {e}")
        sys.exit(1)

    if not collections:
        print("⚠️ Nenhuma coleção encontrada no banco de dados!")
        sys.exit(0)

    print(f"✅ {len(collections)} coleção(ões) encontrada(s):\n")

    schema = {
        "_metadata": {
            "introspected_at": datetime.now().isoformat(),
            "tool": "firestore_introspect.py",
            "mode": "READ_ONLY",
            "samples_per_collection": SAMPLE_DOCS_PER_COLLECTION,
        },
        "collections": {},
    }

    for col_ref in collections:
        col_name = col_ref.id
        print(f"📁 Introspeccionando: {col_name}")
        schema["collections"][col_name] = introspect_collection(db, col_ref)

        fields_count = len(schema["collections"][col_name]["fields"])
        docs_count = schema["collections"][col_name]["document_count_sampled"]
        print(f"  ✅ {docs_count} doc(s) amostrado(s), {fields_count} campo(s) detectado(s)")

    # ─── Salvar output ────────────────────────────────────────────────────────
    OUTPUT_FILE.parent.mkdir(exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(schema, f, ensure_ascii=False, indent=2, default=str)

    print(f"\n✅ Schema salvo em: {OUTPUT_FILE}")

    # ─── Resumo no terminal ───────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("📊 RESUMO DO SCHEMA ENCONTRADO:")
    print("=" * 60)
    for col_name, col_data in schema["collections"].items():
        print(f"\n🗂️  {col_name}")
        print(f"   Docs amostrados: {col_data['document_count_sampled']}")
        if col_data.get("fields"):
            print(f"   Campos detectados:")
            for field_name, field_info in col_data["fields"].items():
                nullable_tag = " (nullable)" if field_info.get("nullable") else ""
                print(f"     • {field_name}: {field_info['type']}{nullable_tag}")
        if col_data.get("subcollections"):
            print(f"   Subcoleções: {list(col_data['subcollections'].keys())}")
        if col_data.get("error"):
            print(f"   ⚠️ Erro: {col_data['error']}")

    print("\n" + "=" * 60)
    print(f"✅ Introspecção concluída. Arquivo completo em: {OUTPUT_FILE}")
    print("📌 PRÓXIMO PASSO: Revisar schema e atualizar gemini.md")
    print("=" * 60)


if __name__ == "__main__":
    main()
