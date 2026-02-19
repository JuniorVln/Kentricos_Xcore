# 🧠 SOP: Lead Scoring Engine (Local)

> **Contexto:** Lógica de pontuação de leads executada no cliente (browser) para classificar oportunidades sem persistência no banco.

## 1. Score Base (0-100)

O score é calculado somando pesos de 3 dimensões principais:

### A. Cargo (40pts)
- **High (40pts):** C-Level, Diretor, VP, Sócio, Fundador.
- **Med (20pts):** Gerente, Head, Coordenador.
- **Low (5pts):** Analista, Assistente, Estagiário, Outros.

### B. Receita (30pts)
- **High (30pts):** > R$ 100MM.
- **Med (15pts):** R$ 10MM - R$ 100MM.
- **Low (5pts):** < R$ 10MM.

### C. Maturidade (30pts)
- **High Potential (30pts):** "Iniciante" ou "Básico" (Maior dor = Maior oportunidade de venda).
- **Med Potential (15pts):** "Intermediário".
- **Low Potential (5pts):** "Avançado".

## 2. Flags de Qualificação

- **🔥 HOT LEAD:** Score >= 75
- **⚠️ WARM LEAD:** Score >= 50
- **❄️ COLD LEAD:** Score < 50

## 3. Implementação Técnica

Arquivo: `src/lib/scorer.ts`

```typescript
export function calculateScore(lead: Assessment): number {
  let score = 0;
  score += getRoleScore(lead.cargo);
  score += getRevenueScore(lead.receitaAnual);
  score += getMaturityScore(lead.nivelMaturidadeSelecionado);
  return Math.min(100, score);
}
```

## 4. Manutenção

As regras devem ser carregadas de `scoring_config.json` se possível, ou definidas como constantes exportadas para fácil ajuste.
