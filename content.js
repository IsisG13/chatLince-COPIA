let isActive = true; // Estado inicial do bot

// Função para injetar o iframe
function injectIframe() {
    const existingIframe = document.getElementById('my-custom-iframe');
    if (existingIframe) return existingIframe; // Evita injetar múltiplos iframes

    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.style.width = '75%'; // Ajusta a largura do aplicativo
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'my-custom-iframe';
    iframe.src = chrome.runtime.getURL('iframe.html'); // Define a fonte do iframe
    iframe.style.width = '25%';
    iframe.style.height = '100%';
    iframe.style.background = 'white';
    iframe.style.zIndex = '2000';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.top = '0';
    iframe.style.border = 'none';
    iframe.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    document.body.appendChild(iframe); // Adiciona o iframe ao corpo do documento

    return iframe;
}

// Função para verificar o estado do bot com base no chat atual
function checkBotState() {
    const chatId = getChatId();
    if (chatId) {
        const storedState = localStorage.getItem(`botState-${chatId}`);
        isActive = storedState !== 'false'; // Se não estiver armazenado, o padrão é 'true'
    } else {
        isActive = true;
    }
}

// Função para obter o nome do contato da conversa atual
function getChatId() {
    const headerTitle = document.querySelector('header span[dir="auto"]'); // Seletor para o nome do contato
    return headerTitle ? headerTitle.textContent : '...'; // Retorna o nome do contato ou '...'
}

// Função para atualizar o iframe com as informações atuais
function updateIframe() {
    const iframe = document.getElementById('my-custom-iframe');
    if (!iframe) return;

    const data = {
        type: 'update',
        isActive: isActive,
        chatTitle: getChatId(),
    };

    iframe.contentWindow.postMessage(data, '*');
}

// Função para ativar o bot ao mudar de chat
function activateBotOnChatChange() {
    isActive = true;
    checkBotState(); // Verifica o estado do bot ao mudar de chat
    updateIframe();
}

// Observador para detectar mudanças de chat
const chatObserver = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Aguarda um pequeno intervalo para garantir que o DOM foi atualizado
            setTimeout(() => {
                activateBotOnChatChange();
            }, 1000);
            break;
        }
    }
});

// Listener para mensagens recebidas do iframe
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'toggle') {
        isActive = event.data.isActive;
        const chatId = getChatId();
        if (chatId) {
            localStorage.setItem(`botState-${chatId}`, isActive); // Armazena o estado do bot para o chat atual
        }
        updateIframe();
    }
});

// Iniciar observação de mudanças no chat
function startChatObserver() {
    const chatList = document.querySelector('#pane-side');
    if (chatList) {
        chatObserver.observe(chatList, { childList: true, subtree: true });
    } else {
        // Tenta novamente após um tempo se o chatList não estiver disponível
        setTimeout(startChatObserver, 1000);
    }
}

// Inicialização ao carregar a página
window.addEventListener('load', () => {
    injectIframe();
    updateIframe();
    startChatObserver();
});

