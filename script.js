// Selecionando os elementos das telas e botões
const btnStart = document.getElementById('btn-start');
const screenEntry = document.getElementById('screen-entry');
const screenHub = document.getElementById('screen-hub');

// Configuração do Áudio
// DICA: Coloque um arquivo .mp3 na mesma pasta e mude o nome abaixo
const bgMusic = new Audio('audio_fundo.mp3'); 
bgMusic.loop = true;
bgMusic.volume = 0.5; // Volume em 50% para não começar estourado

// Função principal de transição
btnStart.addEventListener('click', () => {
    
    // Tenta tocar a música assim que o usuário clica
    bgMusic.play().then(() => {
        console.log("Áudio iniciado com sucesso!");
    }).catch(error => {
        console.log("Erro ao iniciar áudio. Verifique o caminho do arquivo:", error);
    });

    // Animação de saída da primeira tela
    screenEntry.style.opacity = '0';
    
    // Pequeno delay para a animação de fade-out terminar
    setTimeout(() => {
        screenEntry.classList.remove('active');
        screenHub.classList.add('active');
        
        // Faz a segunda tela aparecer suavemente
        screenHub.style.opacity = '0';
        setTimeout(() => {
            screenHub.style.opacity = '1';
        }, 50);
        
    }, 800);
});

// Lógica para os botões de "JOGAR" dos cards
const playButtons = document
