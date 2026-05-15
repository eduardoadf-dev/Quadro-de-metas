// ===========================================
// 1. SELECIONANDO ELEMENTOS DO HTML
// ===========================================

const formulario = document.getElementById('dream-form');
const inputImagem = document.getElementById('image-url');
const inputTitulo = document.getElementById('dream-title');
const gridSonhos = document.getElementById('dreams-grid');
const estadoVazio = document.getElementById('empty-state');

// ===========================================
// 2. CAMADA DE STORAGE (ABSTRAÇÃO)
// Centraliza o acesso ao localStorage.
// Se futuramente quiser trocar para outro
// mecanismo de persistência, basta alterar aqui.
// ===========================================

const CHAVE_STORAGE = 'meus-sonhos';

const Storage = {
  get() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    if (!dados) return [];
    try {
      return JSON.parse(dados);
    } catch {
      return [];
    }
  },
  set(sonhos) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(sonhos));
  }
};

// ===========================================
// 3. CRIAR O CARD DAS METAS
// Usa createElement + textContent para evitar XSS.
// Event listeners adicionados diretamente nos elementos,
// sem usar onclick inline no innerHTML.
// ===========================================

function criarCardSonho(sonho) {
  const card = document.createElement('div');
  card.className = 'card';

  // --- Imagem ---
  const cardImagem = document.createElement('div');
  cardImagem.className = 'card-imagem';
  if (sonho.status === 'Conquistado') {
    cardImagem.classList.add('conquistado');
  }

  const img = document.createElement('img');
  img.setAttribute('src', sonho.urlImagem);
  img.setAttribute('alt', sonho.titulo); // Seguro: não interpreta HTML
  // Tratamento de erro de imagem: exibe placeholder se URL for inválida
  img.onerror = () => {
    img.src = 'https://placehold.co/400x300?text=Imagem+não+encontrada';
  };

  // --- Botão Remover ---
  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn-remover';
  btnRemover.setAttribute('aria-label', 'Remover meta');

  // SVG do ícone de fechar (seguro — não vem de input do usuário)
  btnRemover.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;
  // Event listener sem onclick inline
  btnRemover.addEventListener('click', () => removerSonho(sonho.id));

  cardImagem.appendChild(img);
  cardImagem.appendChild(btnRemover);

  // --- Conteúdo do Card ---
  const cardConteudo = document.createElement('div');
  cardConteudo.className = 'card-conteudo';

  const h3 = document.createElement('h3');
  h3.textContent = sonho.titulo; // textContent previne XSS
  if (sonho.status === 'Conquistado') {
    h3.classList.add('conquistado');
  }

  const btnStatus = document.createElement('button');
  btnStatus.className = `btn-status ${sonho.status}`;
  btnStatus.textContent = sonho.status; // textContent previne XSS
  // Event listener sem onclick inline
  btnStatus.addEventListener('click', () => alternarStatus(sonho.id));

  cardConteudo.appendChild(h3);
  cardConteudo.appendChild(btnStatus);

  // --- Montagem final do Card ---
  card.appendChild(cardImagem);
  card.appendChild(cardConteudo);

  return card;
}

// ===========================================
// 4. RENDERIZAR METAS NA TELA
// ===========================================

function renderizarSonhos() {
  const sonhos = Storage.get();

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
// 5. EVENTO DO FORMULÁRIO (ADICIONAR)
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
// 6. ADICIONAR UMA NOVA META
// ===========================================

function adicionarSonho(urlImagem, titulo) {
  const sonhos = Storage.get();

  const novoSonho = {
    id: crypto.randomUUID(),
    titulo: titulo,
    urlImagem: urlImagem,
    status: 'Sonho',
  };

  sonhos.push(novoSonho);
  Storage.set(sonhos);
  renderizarSonhos();
}

// ===========================================
// 7. REMOVER META
// ===========================================

function removerSonho(id) {
  if (!confirm('Remover esta meta?')) return;

  let sonhos = Storage.get();
  sonhos = sonhos.filter(sonho => sonho.id !== id);
  Storage.set(sonhos);
  renderizarSonhos();
}

// ===========================================
// 8. ALTERNAR STATUS DA META
// Também aplica/remove classes visuais de "Conquistado"
// que existiam no CSS mas não eram usadas antes.
// ===========================================

function alternarStatus(id) {
  const sonhos = Storage.get();
  const sonho = sonhos.find(s => s.id === id);

  if (sonho) {
    if (sonho.status === 'Sonho') {
      sonho.status = 'Progresso';
    } else if (sonho.status === 'Progresso') {
      sonho.status = 'Conquistado';
    } else {
      sonho.status = 'Sonho';
    }

    Storage.set(sonhos);
    renderizarSonhos();
  }
}

// ===========================================
// 9. INICIALIZAÇÃO
// ===========================================

renderizarSonhos();
