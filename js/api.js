// ⚠️ ATENÇÃO: Como o Render não deixou mudar o link, use o link QUE ESTÁ FUNCIONANDO.
const API_URL = "https://consorcio-hub-api.onrender.com";

/**
 * Envia dados de captura de qualquer Landing Page para o Pipeline do CRM
 * @param {Object} dados - Objeto contendo name, phone, email, produto_interesse, valor_estimado e usuario_id
 */
async function enviarLeadParaCRM(dados) {
    try {
        const payload = {
            cliente_nome: dados.name,
            cliente_whats: dados.phone,
            cliente_email: dados.email, // <--- Envie como cliente_email
            usuario_id: dados.usuario_id,
            tipo_credito: dados.produto_interesse,
            valor_credito: dados.valor_estimado,
            dados_adicionais: { email: dados.email } // Backup
        };

        const response = await fetch(`${API_URL}/simular/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        // ... resto do código

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro de conexão com o servidor CRM");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Falha na sincronização do lead:", error);
        throw error;
    }
}