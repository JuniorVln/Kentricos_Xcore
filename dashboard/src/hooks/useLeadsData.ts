import { useState, useEffect } from 'react';

import { processLeads, type ScoredAssessment } from '../lib/scorer';

// Simple in-memory cache to avoid refetching on tab switch
let cachedData: ScoredAssessment[] | null = null;

export function useLeadsData() {
    const [loading, setLoading] = useState(!cachedData);
    const [data, setData] = useState<ScoredAssessment[]>(cachedData || []);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (cachedData) return;

        async function load() {
            try {
                setLoading(true);

                // MODO MOCK ATIVADO (Para visualizar dados reais do print)
                // const res = await api.getAllAssessments(1000);
                // if (res.error) throw res.error;
                // const list = res.data;

                const { MOCK_LEADS } = await import('../data/mock_leads');
                const list = MOCK_LEADS;

                const processed = processLeads(list);
                cachedData = processed;
                setData(processed);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { loading, error, data };
}
