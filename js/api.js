// =========================================================================
// CONFIGURAÇÃO DO FACEBOOK PIXEL
// =========================================================================
// Se os dois sites (veículos e imóveis) usam Pixels diferentes, troque o ID
// abaixo pelo Pixel correspondente em cada domínio, ou centralize em uma
// única variável de ambiente/config caso o código seja compartilhado.
const FACEBOOK_PIXEL_ID = "1491480098750577";

// Base code oficial do Facebook Pixel (carrega o script fbevents.js)
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', FACEBOOK_PIXEL_ID);
fbq('track', 'PageView');

// =========================================================================
// CONFIGURAÇÃO DO BACKEND / CRM
// =========================================================================
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Erro de integração");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Erro na sincronização:", error);
        throw error;
    }
}

// =========================================================================
// PIXEL DE LEAD: dispara sempre que o usuário completa o formulário
// =========================================================================
// IMPORTANTE: esta função precisa ser chamada tanto no sucesso (.then)
// quanto na falha de rede/CORS (.catch) do envio do formulário no
// index.html — porque nos dois casos o usuário já preencheu tudo e viu a
// tela de sucesso com o botão do WhatsApp. Se você só disparar no .then,
// perde a contagem de leads sempre que o CRM estiver fora do ar.
function dispararPixelLeadSucesso(valorCredito) {
    if (typeof fbq !== 'function') {
        console.warn('fbq não está definido — Pixel não carregou.');
        return;
    }

    // Busca o valor que o cliente selecionou no Passo 1 (guardado no input hidden)
    const interesseEl = document.getElementById('interesse');
    const interesseReal = (interesseEl && interesseEl.value) || "Consórcio";

    // Converte o valor limpo para o Pixel (ex: 100000)
    const valorParaPixel = parseFloat(valorCredito) || 0;

    const eventPayload = {
        content_name: 'Simulação ' + interesseReal,
        content_category: 'Consórcio'
    };

    // Só envia value/currency se houver um valor real, para não distorcer
    // otimizações futuras por valor de lead com um monte de eventos "R$0".
    if (valorParaPixel > 0) {
        eventPayload.value = valorParaPixel;
        eventPayload.currency = 'BRL';
    }

    fbq('track', 'Lead', eventPayload);
}