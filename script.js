// ===========================================
// 1. SELECIONANDO ELEMENTOS DO HTML
// ===========================================

const formulario = document.getElementById('dream-form');
const inputImagem = document.getElementById('image-url');
const inputTitulo = document.getElementById('dream-title');
const gridSonhos = document.getElementById('dreams-grid');
const estadoVazio = document.getElementById('empty-state');

// ===========================================
// 2. CRIAR O CARD DAS METAS (HTML)
// ===========================================

function criarCardSonho(sonho) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="card-imagem">
      <img src="${sonho.urlImagem}" alt="${sonho.titulo}">
      <button class="btn-remover" onclick="removerSonho('${sonho.id}')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="card-conteudo">
      <h3>${sonho.titulo}</h3>
      <button class="btn-status ${sonho.status}" onclick="alternarStatus('${sonho.id}')">
        ${sonho.status}
      </button>
    </div>
  `;

  return card;
}

// ===========================================
// 3. RENDERIZAR METAS NA TELA
// ===========================================

function renderizarSonhos() {
  const sonhos = carregarSonhos();

  gridSonhos.innerHTML = '';

  if (sonhos.length === 0) {
    estadoVazio.classList.remove('hidden');
    gridSonhos.classList.add('hidden');
  } else {
    estadoVazio.classList.add('hidden');
    gridSonhos.classList.remove('hidden');

    sonhos.forEach(sonho => {
      const card = criarCardSonho(sonho);
      gridSonhos.appendChild(card);
    });
  }
}

// ===========================================
// 4. EVENTO DO FORMULÁRIO (ADICIONAR)
// ===========================================

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const urlImagem = inputImagem.value.trim();
  const titulo = inputTitulo.value.trim();

  if (urlImagem && titulo) {
    adicionarSonho(urlImagem, titulo);
    inputImagem.value = '';
    inputTitulo.value = '';
    inputImagem.focus();
  }
});

// ===========================================
// 5. ADICIONAR UMA NOVA META
// ===========================================

function adicionarSonho(urlImagem, titulo) {
  const sonhos = carregarSonhos();

  const novoSonho = {
    id: crypto.randomUUID(),
    titulo: titulo,
    urlImagem: urlImagem,
    status: 'sonho',
  };

  sonhos.push(novoSonho);
  salvarSonhos(sonhos);
  renderizarSonhos();
}

// ===========================================
// 6. REMOVER META
// ===========================================

function removerSonho(id) {
  if (!confirm('Remover esta meta?')) return;

  let sonhos = carregarSonhos();
  sonhos = sonhos.filter(sonho => sonho.id !== id);
  salvarSonhos(sonhos);
  renderizarSonhos();
}

// ===========================================
// 7. ALTERNAR STATUS DA META
// ===========================================

function alternarStatus(id) {
  const sonhos = carregarSonhos();
  const sonho = sonhos.find(s => s.id === id);

  if (sonho) {
    if (sonho.status === 'sonho') {
      sonho.status = 'progresso';
    } else if (sonho.status === 'progresso') {
      sonho.status = 'conquistado';
    } else {
      sonho.status = 'sonho';
    }

    salvarSonhos(sonhos);
    renderizarSonhos();
  }
}

// ===========================================
// 8. SALVAR NO LOCALSTORAGE
// ===========================================

const CHAVE_STORAGE = 'meus-sonhos';

function salvarSonhos(sonhos) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(sonhos));
}

function carregarSonhos() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) return [];
  return JSON.parse(dados);
}

// ===========================================
// 9. INICIALIZAÇÃO
// ===========================================

renderizarSonhos();
