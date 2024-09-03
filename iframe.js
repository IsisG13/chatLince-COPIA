let isActive = false;  

function updateUI(data) {  
    const statusIndicator = document.getElementById('status-indicator');  
    const chatTitleElement = document.getElementById('chat-title');  
    const toggleButton = document.getElementById('toggle-button');  

    isActive = data.isActive;  

    statusIndicator.textContent = isActive ? 'Bot ON' : `Bot desativado para: ${data.chatTitle}`;  
    statusIndicator.style.color = isActive ? 'green' : 'red';  

    chatTitleElement.textContent = isActive ? data.chatTitle || '...' : '';  

    toggleButton.textContent = isActive ? 'Bot OFF' : 'Bot ON';  
}  

function toggleBot() {  
    isActive = !isActive;  
    window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');  
}  

function handleTokenSubmit() {  
    const tokenInput = document.getElementById('token-input');  
    const token = tokenInput.value;  
    const errorMessage = document.getElementById('error-message');  

    // Aqui você valida o token (simulação de validação)  
    if (validateToken(token)) {  
        errorMessage.style.display = 'none'; // Esconde a mensagem de erro  
        document.getElementById('token-request').style.display = 'none';  
        document.getElementById('status-indicator').style.display = 'block';  
        document.getElementById('chat-info').style.display = 'grid';  
        document.getElementById('toggle-button').style.display = 'block';  

        // Envie mensagem para o content script para atualizar o iframe  
        window.parent.postMessage({ type: 'update', isActive, chatTitle: 'Nome do Contato' }, '*');  
    } else {  
        errorMessage.style.display = 'block'; // Mostra a mensagem de erro  
    }  
}  

// Função de validação do token  
function validateToken(token) {  
    // A lógica de validação do token deve ser implementada aqui  
    return token === 'lincedelivery_1234'; // Simulação  
}  

// Listener para o botão de envio do token  
window.addEventListener('load', () => {  
    const toggleButton = document.getElementById('toggle-button');  
    toggleButton.addEventListener('click', toggleBot);  
    
    const submitTokenButton = document.getElementById('submit-token');  
    submitTokenButton.addEventListener('click', handleTokenSubmit);  
});  

// Listener para mensagens recebidas do content script  
window.addEventListener('message', (event) => {  
    if (event.data && event.data.type === 'update') {  
        updateUI(event.data);  
    }  
});