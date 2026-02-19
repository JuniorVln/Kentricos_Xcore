/**
 * INSTRUÇÕES:
 * 1. Abra o navegador onde você está logado no Admin do XCore (https://xcore-assessment.web.app/admin).
 * 2. Abra o Console do Desenvolvedor (F12 ou Botão Direito > Inspecionar > Console).
 * 3. Copie e cole todo o código abaixo e aperte Enter.
 * 4. Um texto JSON será copiado para sua área de transferência.
 * 5. Crie um arquivo chamado 'leads.json' dentro desta pasta 'dados mock' e cole o conteúdo.
 */

(function extractTableData() {
    // Tenta encontrar a tabela principal
    const rows = document.querySelectorAll('tr');
    if (rows.length === 0) {
        console.warn("⚠️ Nenhuma tabela <tr> encontrada. O site pode usar divs ou canvas.");
        alert("Não encontrei uma tabela HTML padrão. Verifique o console.");
        return;
    }

    console.log(`🔍 Encontradas ${rows.length} linhas... Processando.`);

    // Tentar extrair cabeçalhos (TH)
    const headers = Array.from(document.querySelectorAll('thead th')).map(th =>
        th.innerText.trim().replace(/\s+/g, '_').toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
    );

    // Se não achar THEAD, tenta pegar da primeira TR
    const pHeaders = headers.length > 0 ? headers : Array.from(rows[0].querySelectorAll('td, th')).map((c, i) => `col_${i}`);

    const data = [];

    // Pula header se ele existir na contagem de linhas
    const startRow = document.querySelector('thead') ? 0 : 1;
    const tbodyRows = document.querySelectorAll('tbody tr');
    const targetRows = tbodyRows.length > 0 ? tbodyRows : Array.from(rows).slice(startRow);

    targetRows.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length === 0) return;

        const rowData = {};
        cells.forEach((cell, index) => {
            const headerName = pHeaders[index] || `col_${index}`;
            // Tenta pegar texto limpo
            rowData[headerName] = cell.innerText.trim();
        });
        data.push(rowData);
    });

    console.log("✅ Dados extraídos com sucesso:", data);

    // Copiar para clipboard
    const json = JSON.stringify(data, null, 2);

    // Método moderno de clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => {
            console.log("📋 JSON copiado para a área de transferência!");
            alert("Sucesso! Os dados foram copiados. Cole no arquivo 'dados mock/leads.json'.");
        }).catch(err => {
            console.error("Erro ao copiar automáticamenet:", err);
            console.log("Copie o JSON abaixo manualmente:");
            console.log(json);
        });
    } else {
        console.log("📋 Copie o JSON abaixo:");
        console.log(json);
    }
})();
