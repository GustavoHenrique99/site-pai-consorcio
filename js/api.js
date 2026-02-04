// ⚠️ ATENÇÃO: Como o Render não deixou mudar o link, use o link QUE ESTÁ FUNCIONANDO.
// O cliente final NÃO VÊ esse link, ele é invisível no código-fonte do navegador.
const API_URL = "https://consorcio-hub-api.onrender.com"; 

/**
 * Envia dados de captura de qualquer Landing Page para o Pipeline do CRM
 * @param {Object} dados - Objeto contendo name, phone, email, produto_interesse, valor_estimado e usuario_id
 */
async function enviarLeadParaCRM(dados) {
    try {
        // Mapeamento Inteligente: Transforma dados amigáveis do Site em campos do Banco de Dados
        const payload = {
            name: dados.name,
            phone: dados.phone,
            email: dados.email || "",
            
            // "Produto" vira "credit_type" para o backend processar sem erros
            credit_type: dados.produto_interesse || "Oportunidade Geral", 
            
            // "Valor" vira "credit_value" 
            credit_value: dados.valor_estimado || 0,

            // CRÍTICO: Identifica qual usuário do SaaS receberá este lead no Dashboard
            usuario_id: dados.usuario_id || 2 
        };

        const response = await fetch(`${API_URL}/api/public/leads`, {
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