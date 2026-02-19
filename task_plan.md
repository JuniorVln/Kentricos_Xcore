# 📋 XCore — Task Plan

> **Protocolo:** B.L.A.S.T. | **Última Atualização:** 2026-02-19  
> **Fase Atual:** 🔴 Phase 4 — Stylize & Refine

---

## 🟢 Phase 3 — Architect (Concluído)
- [x] **Setup React:** Vite + TS + Tailwind + Firebase + Recharts
- [x] **Módulo 1 (Geral):**
  - Hook `useLeadsData` (Cache + Fetch)
  - Hook `useMetrics` (Agregação)
  - UI: KPI Cards + Gráficos (Receita/Maturidade)
- [x] **Módulo 2 (Listagem):**
  - Tabela TanStack (Sort/Pagination)
  - Colunas Customizadas com Badges (HOT/WARM/COLD)
- [x] **Módulo 3 (Scoring):**
  - Engine em TypeScript (`scorer.ts`)
  - ConfigJson (`scoring_config.json`) movido para `src/config`
- [x] **Integração:** `App.tsx` com Roteamento por Abas

## 🔴 Phase 4 — Stylize (Próximo)
- [ ] Refinar paleta de cores (Azul Institucional validado?)
- [ ] Melhorar responsividade mobile (Sidebar colapsável?)
- [ ] Feedback visual de loading (Skeletons)
- [ ] Tratamento de erros de permissão mais amigável

## 🔴 Phase 5 — Trigger
- [ ] `npm run build`
- [ ] `firebase deploy`
