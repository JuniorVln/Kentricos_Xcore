# 🏗️ SOP: Arquitetura do Dashboard (Módulo 1 & 2)

> **Contexto:** Construção do dashboard React read-only conectado ao Firestore.

## 1. Estrutura de Dados (Client-Side)

Utilizaremos uma interface TypeScript estrita para evitar erros de runtime com dados inferidos.

```typescript
export interface Assessment {
  id: string; // Document ID
  data: Date;
  empresa: string;
  email: string;
  celular: string;
  receitaAnual: string;
  setor: string;
  nivelMaturidadeSelecionado: string;
  pontuacaoTotalFinal: number;
  
  // Campos calculados (Local Scoring)
  _score?: number;
  _flag?: 'HIGH' | 'MEDIUM' | 'LOW';
}
```

## 2. Padrão de Leitura (Queries)

Para otimizar performance e custos (read-only):

1. **Initial Load:** Queries com `limit(50)` ordenados por `data desc`.
2. **Paginação:** Usar `startAfter` com o último doc visível.
3. **Filtros:**
   - Se filtrar por campos indexados (`setor`, `receita`), usar `where()`.
   - Se filtrar por busca textual (nome da empresa), baixar chunk maior e filtrar em memória (se dataset < 1000 docs) ou alertar complexidade.

## 3. Estado & Gerenciamento

- **React Query (TanStack Query):** Para cache, re-fetch e loading states.
- **Context API:** Para filtros globais (Date Range Picker).

## 4. UI/UX Guidelines

- **Cor Primária:** Azul Escuro (institucional Kentricos).
- **Cor Secundária:** Dourado/Amarelo (destaque/score alto).
- **Fontes:** System sans-serif ou Montserrat (se disponível).
- **Feedback:** Skeletons durante loading. Toasts para erros.

## 5. Módulo 1: Visão Geral

Ocupa a rota `/`.
- **KPIs:** Cards no topo.
- **Gráficos:** Recharts (Pie/Bar). Devem respeitar o filtro de data global.

## 6. Módulo 2: Listagem

Ocupa a rota `/leads`.
- **Tabela:** TanStack Table.
- **Colunas:** Data, Empresa, Contato, Receita, Score (via Python logic).
- **Ações:** Detalhes (modal view json).

---

**Edge Cases:**
- Campos nulos no banco → Exibir "-" ou "N/A".
- Erro de permissão → Exibir mensagem amigável "Acesso negado. Verifique suas permissões."
