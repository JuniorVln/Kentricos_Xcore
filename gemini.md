# Documentação do Projeto XCore

## Módulo 3: Sistema de Scoring

### Schema do `scoring_config.json`
Este arquivo é a fonte de verdade para as regras de pontuação de leads. Use-o para ajustar pesos, definir cargos quentes/mornos e configurar as faixas de pontuação.

***Para alterar regras de scoring, editar apenas `scoring_config.json`***.

> **Nota**: Regras serão revisadas após conexão com Firebase real.

```json
{
  "cargos_alto_potencial": {
    "hot": ["CEO", "Diretor", "VP..."],
    "warm": ["Gerente", "Head..."],
    "cold": []
  },
  "faixas_pontuacao": {
    "hot": { "min": 70, "max": 100 },
    "warm": { "min": 40, "max": 69 },
    "cold": { "min": 0, "max": 39 }
  },
  "cores": {
    "hot": "#HexCode",
    "warm": "#HexCode",
    "cold": "#HexCode"
  },
  "regra_combinada": {
    "peso_cargo": 0.4,
    "peso_pontuacao": 0.6
  }
}
```
