// Verifique no seu Render se a URL é 'consorcio-hub-api' ou 'elite-crm-backend'
const API_URL = "https://elite-crm-backend.onrender.com"; 

/**
 * Envia leads para o CRM com suporte a PARCELA e QUALIFICAÇÃO
 */
async function enviarLeadParaCRM(dados) {
    try {
        // Mapeamento para a rota /api/public/leads (a mais completa que criamos)
        const payload = {
            nome: dados.name,
            whatsapp: dados.phone,
            email: dados.email,
            interesse: dados.produto_interesse,
            valor_credito: dados.valor_estimado,
            // NOVOS CAMPOS QUE O MAIN.PY AGORA TRATA:
            parcela_escolhida: dados.parcela_escolhida || "0",
            profissao: dados.profissao || "Não informado",
            renda: dados.renda || "Não informado",
            reserva_lance: dados.reserva_lance || "Não informado",
            usuario_id: dados.usuario_id || 2
        };

        // Alterado para /api/public/leads para aceitar os campos de qualificação e parcela
        const response = await fetch(`${API_URL}/api/public/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro de integração");
        }
        
        return await response.json();
    } catch (error) {
        console.error("❌ Erro na sincronização:", error);
        throw error;
    }
}

// =========================================================================
// CORREÇÃO CIRÚRGICA DO PIXEL: Pegando o interesse real do Passo 1
// =========================================================================

// Esta função deve ser chamada dentro do bloco try/catch do envio do formulário, 
// LOGO APÓS o 'await enviarLeadParaCRM(dadosParaEnviar)'.

function dispararPixelLeadSucesso(valorCredito) {
    // Busca o valor que o cliente selecionou no Passo 1 (guardado no input hidden)
    const interesseReal = document.getElementById('interesse').value || "Consórcio";
    
    // Converte o valor limpo para o Pixel (ex: 100000)
    const valorParaPixel = parseFloat(valorCredito) || 0;

    // Dispara o Pixel com o interesse correto no 'content_name'
    // Ex: 'Simulação Imóvel', 'Simulação Veículo'
    fbq('track', 'Lead', {
        content_name: 'Simulação ' + interesseReal, 
        value: valorParaPixel,
        currency: 'BRL'
    });
}