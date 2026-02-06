// ⚠️ ATENÇÃO: Como o Render não deixou mudar o link, use o link QUE ESTÁ FUNCIONANDO.
const API_URL = "https://consorcio-hub-api.onrender.com"; 

/**
 * Envia dados de captura de qualquer Landing Page para o Pipeline do CRM
 * @param {Object} dados - Objeto contendo name, phone, email, produto_interesse, valor_estimado e usuario_id
 */
async function enviarLeadParaCRM(dados) {
    try {
        // Mapeamento Inteligente: Transforma dados amigáveis do Site em campos do Banco de Dados
        const payload = {
            cliente_nome: dados.name,
            cliente_whats: dados.phone,
            cliente_email: dados.email || "", // Correção: Mapeado para o nome correto da coluna no banco
            
            // "Produto" vira "tipo_credito" para o backend
            tipo_credito: dados.produto_interesse || "Oportunidade Geral", 
            
            // "Valor" vira "valor_credito" 
            valor_credito: dados.valor_estimado || 0,

            // CRÍTICO: Identifica qual usuário do SaaS receberá este lead
            usuario_id: dados.usuario_id || 2,

            // BLINDAGEM: Envia o email também dentro de dados_adicionais como garantia
            dados_adicionais: {
                email: dados.email || "",
                origem: "Site Oficial"
            }
        };

        // Rota correta do seu backend para simulações
        const response = await fetch(`${API_URL}/simular/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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