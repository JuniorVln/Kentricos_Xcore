import { useMemo } from 'react';
import { useLeadsData } from './useLeadsData';

export function useMetrics(startDate?: Date | null, endDate?: Date | null) {
    const { loading, error, data } = useLeadsData();

    const metrics = useMemo(() => {
        if (!data.length) return null;

        // Filter by Date
        const filteredData = data.filter(d => {
            if (!d.data) return true; // Keep if no date?? Or exclude? Assuming keep.
            // Parse date dd/mm/yyyy
            try {
                const parts = d.data.split('/');
                if (parts.length !== 3) return true;
                const docDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));

                if (startDate && docDate < startDate) return false;
                if (endDate && docDate > endDate) return false;
                return true;
            } catch (e) { return true; }
        });

        const total = filteredData.length;

        // Distribuição de Receita
        const receitaMap: Record<string, number> = {};
        filteredData.forEach(d => {
            const k = d.receitaAnual || 'Não informado';
            receitaMap[k] = (receitaMap[k] || 0) + 1;
        });
        const receitaChart = Object.entries(receitaMap).map(([name, value]) => ({ name, value }));

        // Distribuição de Nível
        const nivelMap: Record<string, number> = {};
        filteredData.forEach(d => {
            const k = d.nivelMaturidadeSelecionado || 'N/A';
            nivelMap[k] = (nivelMap[k] || 0) + 1;
        });
        const nivelChart = Object.entries(nivelMap).map(([name, value]) => ({ name, value }));

        // Distribuição de Setor
        const setorMap: Record<string, number> = {};
        filteredData.forEach(d => {
            const k = d.setor || 'Não informado';
            setorMap[k] = (setorMap[k] || 0) + 1;
        });
        const setorChart = Object.entries(setorMap).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Distribuição de Pontuação
        const scoreRanges = { '0-30': 0, '31-60': 0, '61-80': 0, '81-100': 0 };
        filteredData.forEach(d => {
            const s = d.pontuacaoTotalFinal || 0;
            if (s <= 30) scoreRanges['0-30']++;
            else if (s <= 60) scoreRanges['31-60']++;
            else if (s <= 80) scoreRanges['61-80']++;
            else scoreRanges['81-100']++;
        });
        const scoreChart = Object.entries(scoreRanges).map(([name, value]) => ({ name, value }));

        // Expectativa vs Realidade (Scatter Data)
        // x: Nível Selecionado (Map string to index?), y: Score
        const expectationChart = filteredData.map(d => ({
            name: d.empresa,
            autoLevel: d.nivelMaturidadeSelecionado || 'N/A',
            score: d.pontuacaoTotalFinal || 0,
            revenue: d.receitaAnual
        })).slice(0, 50); // Limit points for visibility

        // Leads Quentes vs Frios
        const hot = filteredData.filter(d => d._flag === 'HOT').length;
        const warm = filteredData.filter(d => d._flag === 'WARM').length;
        const cold = filteredData.filter(d => d._flag === 'COLD').length;

        const leadsWithScore = filteredData.filter(d => d.pontuacaoTotalFinal != null);
        const avgScore = leadsWithScore.length
            ? leadsWithScore.reduce((acc, curr) => acc + (curr.pontuacaoTotalFinal || 0), 0) / leadsWithScore.length
            : 0;

        return {
            total,
            avgScore,
            receitaChart,
            nivelChart,
            setorChart,
            scoreChart,
            expectationChart,
            quality: { hot, warm, cold }
        };
    }, [data, startDate, endDate]);

    return { loading, error, metrics };
}
