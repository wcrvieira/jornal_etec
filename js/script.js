// CONFIGURAÇÕES DA API (Substitua pelas URLs do seu Backend real)
const API_URL_BASE = 'https://sua-api-backend.com/api';

// Estado da aplicação
let currentUser = localStorage.getItem('registeredUser') || null;
let pdfData = []; // Armazenará os dados vindos do backend

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateUserUI();
    fetchInitialData();
});

// 1. BUSCAR DADOS INICIAIS (PDFs e Votos)
async function fetchInitialData() {
    try {        
        pdfData = [
            { id: 1, title: 'Jornal A Study in Scarlet', url: 'files/Jornal_A_Study_in_Scarlet.pdf', thumb: 'images/A_Study_in_Scarlet.jpg', votes: 0, userVoted: false },
            { id: 2, title: 'Jornal Brasil', url: 'files/Jornal_Brasil.pdf', thumb: 'images/Jornal_Brasil.jpg', votes: 0, userVoted: false },
            { id: 3, title: 'Jornal Brasil LM', url: 'files/Jornal_Brasil_LM.pdf', thumb: 'images/Jornal_Brasil_LM.jpg', votes: 0, userVoted: false },
            { id: 4, title: 'Jornal Conta Tudo', url: 'files/Jornal_Conta_Tudo.pdf', thumb: 'images/Jornal_Conta_Tudo.jpg', votes: 0, userVoted: false },
            { id: 5, title: 'Jornal Copa do Mundo', url: 'files/Jornal_Copa_do_Mundo.pdf', thumb: 'images/Jornal_Copa_do_Mundo.jpg', votes: 0, userVoted: false },
            { id: 6, title: 'Jornal Culturizando', url: 'files/Jornal_Culturizando.pdf', thumb: 'images/Jornal_Culturizando.jpg', votes: 0, userVoted: false },
            { id: 7, title: 'Jornal da Iasmyn', url: 'files/Jornal_da_Iasmyn.pdf', thumb: 'images/Jornal_da_Iasmyn.jpg', votes: 0, userVoted: false },
            { id: 8, title: 'Jornal da MV Vick', url: 'files/Jornal_da_MC_Vick.pdf', thumb: 'images/Jornal_da_MC_Vick.jpg', votes: 0, userVoted: false },
            { id: 9, title: 'Jornal da Record', url: 'files/Jornal_da_Record.pdf', thumb: 'images/Jornal_da_Record.jpg', votes: 0, userVoted: false },
            { id: 10, title: 'Jornal da TecEtec', url: 'files/Jornal_da_tecetec.pdf', thumb: 'images/Jornal_da_tecetec.jpg', votes: 0, userVoted: false },
            { id: 11, title: 'Jornal das Químicas', url: 'files/Jornal_das_qímicas.pdf', thumb: 'images/Jornal_das_qímicas.jpg', votes: 0, userVoted: false },
            { id: 12, title: 'Jornal do Futuro', url: 'files/Jornal_do_Futuro.pdf', thumb: 'images/Jornal_do_Futuro.jpg', votes: 0, userVoted: false },
            { id: 13, title: 'Jornal Esportes', url: 'files/Jornal_Esportes.pdf', thumb: 'images/Jornal_Esportes.jpg', votes: 0, userVoted: false },
            { id: 14, title: 'Jornal Gazeta Cósmica e Crime', url: 'files/Jornal_Gazeta_Cosmica_e_Crime.pdf', thumb: 'images/Jornal_Gazeta_Cosmica_e_Crime.jpg', votes: 0, userVoted: false },
            { id: 15, title: 'Jornal Girls Talk', url: 'files/Jornal_Girls_Talk.pdf', thumb: 'images/Jornal_Girls_Talk.jpg', votes: 0, userVoted: false },
            { id: 16, title: 'Jornal Global', url: 'files/Jornal_Global.pdf', thumb: 'images/Jornal_Global.jpg', votes: 0, userVoted: false },
            { id: 17, title: 'Jornal Informa', url: 'files/Jornal_Informa.pdf', thumb: 'images/Jornal_Informa.jpg', votes: 0, userVoted: false },
            { id: 18, title: 'Jornal Informa Mundo', url: 'files/Jornal_Informa_Mundo.pdf', thumb: 'images/Jornal_Informa_Mundo.jpg', votes: 0, userVoted: false },
            { id: 19, title: 'Jornal Pipoca e Prosa', url: 'files/Jornal_Pipoca_e_Prosa.pdf', thumb: 'images/Jornal_Pipoca_e_Prosa.jpg', votes: 0, userVoted: false },
            { id: 20, title: 'Jornal Seu Mundo Informa', url: 'files/Jornal_Seu_Mundo_Informa.pdf', thumb: 'images/Jornal_Seu_Mundo_Informa.jpg', votes: 0, userVoted: false }
        ];

        renderPDFs();
    } catch (error) {
        console.error("Erro ao buscar dados dos PDFs:", error);
        alert("Falha ao carregar os documentos.");
    }
}

// 2. RENDERIZAR INTERFACE
function renderPDFs() {
    const grid = document.getElementById('pdfGrid');
    grid.innerHTML = ''; // Limpa a grid

    pdfData.forEach(pdf => {
        const card = document.createElement('section');
        card.className = 'pdf-card';

        // Desabilita botões se o usuário não estiver logado
        const btnState = currentUser ? '' : 'disabled';
        const btnClass = currentUser ? '' : 'btn-disabled';

        card.innerHTML = `
                    <img src="${pdf.thumb}" alt="Miniatura ${pdf.title}" class="pdf-thumb" onclick="openModal('${pdf.url}', '${pdf.title}')" title="Clique para ler">
                    <div class="pdf-title">${pdf.title}</div>
                    <div class="vote-controls">
                        <button class="btn-vote ${btnClass}" ${btnState} onclick="handleVote(${pdf.id}, 'upvote')" ${pdf.userVoted ? 'disabled' : ''}>Votar</button>
                        <span class="vote-count" id="count-${pdf.id}">${pdf.votes}</span>
                        <button class="btn-cancel ${btnClass}" ${btnState} onclick="handleVote(${pdf.id}, 'cancel')" ${!pdf.userVoted ? 'disabled' : ''}>Cancelar</button>
                    </div>
                `;
        grid.appendChild(card);
    });
}

// 3. ENVIAR OU CANCELAR VOTOS NA API
async function handleVote(pdfId, action) {
    if (!currentUser) return alert("Por favor, registre-se primeiro.");

    try {
        /* REQUISIÇÃO REAL (Descomente e ajuste para o seu backend)
        const response = await fetch(`${API_URL_BASE}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser, pdfId: pdfId, action: action })
        });
        
        if (!response.ok) throw new Error('Erro ao processar voto');
        const result = await response.json(); // Espera a nova contagem do servidor
        */

        // Lógica de simulação (Mock)
        const pdfIndex = pdfData.findIndex(p => p.id === pdfId);
        if (action === 'upvote') {
            pdfData[pdfIndex].votes += 1;
            pdfData[pdfIndex].userVoted = true;
        } else if (action === 'cancel') {
            pdfData[pdfIndex].votes -= 1;
            pdfData[pdfIndex].userVoted = false;
        }

        // Re-renderiza para atualizar contadores e estado dos botões
        renderPDFs();

    } catch (error) {
        console.error("Erro na votação:", error);
        alert("Ocorreu um erro ao registrar seu voto.");
    }
}

// 4. LÓGICA DO MODAL
function openModal(pdfUrl, title) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('pdfViewer').src = pdfUrl;
    document.getElementById('pdfModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfViewer').src = ''; // Limpa o iframe
}

// 5. REGISTRO DO USUÁRIO
function registerUser() {
    const name = document.getElementById('userNameInput').value.trim();
    if (name.length < 2) return alert("Digite um nome válido.");

    currentUser = name;
    localStorage.setItem('registeredUser', name); // Salva na sessão
    updateUserUI();
    renderPDFs(); // Re-renderiza para habilitar os botões
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('registeredUser');
    updateUserUI();
    renderPDFs(); // Re-renderiza para desabilitar os botões
}

function updateUserUI() {
    if (currentUser) {
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('displayUserName').innerText = `Bem-vindo, ${currentUser}`;
    } else {
        document.getElementById('registerSection').style.display = 'flex';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('userNameInput').value = '';
    }
}
