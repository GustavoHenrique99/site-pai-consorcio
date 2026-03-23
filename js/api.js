// ⚠️ ATENÇÃO: Link do Render atualizado para a rota de captura pública
const API_URL = "https://consorcio-hub-api.onrender.com";

/**
 * Envia dados de captura de qualquer Landing Page para o Pipeline do CRM
 * @param {Object} dados - Objeto contendo nome, whatsapp, email, interesse, valor_credito, parcela_escolhida, profissao e renda
 */
async function enviarLeadParaCRM(dados) {
    try {
        // Mapeamento exato para a rota /api/public/leads do seu novo main.py
        const payload = {
            nome: dados.nome || dados.name,
            whatsapp: dados.whatsapp || dados.phone,
            email: dados.email,
            interesse: dados.interesse || dados.produto_interesse,
            valor_credito: dados.valor_credito || dados.valor_estimado,
            parcela_escolhida: dados.parcela_escolhida || "0",
            profissao: dados.profissao || "Não informado",
            renda: dados.renda || "Não informado",
            reserva_lance: dados.reserva_lance || "Não informado",
            usuario_id: dados.usuario_id || 2, // ID do seu pai
            origem: "Landing Page High-Ticket"
        };

        // Alterado de /simular/ para /api/public/leads para aceitar os novos campos (parcela, profissão, etc)
        const response = await fetch(`${API_URL}/api/public/leads`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

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