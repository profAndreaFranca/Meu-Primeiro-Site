const INITIAL_DATA = [
{
    id: 'c1',
    title: 'Gatos ronronam para se curar',
    text: 'A vibração do ronronar (25–150 Hz) pode estimular a regeneração óssea e reduzir estresse — não é só fofura!',
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1200&auto=format&fit=crop',
    category: 'Animais',
    tags: ['gatos','biologia','frequências']
  },
  {
    id: 'c2',
    title: 'Animes e FPS: por que parecem mais rápidos?',
    text: 'Alguns animes usam 12 fps (animados “on twos”), mas efeitos e cortes dinâmicos criam sensação de velocidade maior.',
    image: 'https://images.unsplash.com/photo-1625080903503-00fef6c5f3b2?q=80&w=1200&auto=format&fit=crop',
    category: 'Animes',
    tags: ['fps','animação','estilo']
  },
  {
    id: 'c3',
    title: 'Buracos negros não “sugam” tudo',
    text: 'Se o Sol virasse um buraco negro com a mesma massa, a Terra continuaria orbitando — só ficaria mais escuro.',
    image: 'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1200&auto=format&fit=crop',
    category: 'Astronomia',
    tags: ['gravidade','espaço','órbitas']
  },
  {
    id: 'c4',
    title: 'Mangá lê-se da direita para a esquerda',
    text: 'A ordem de leitura tradicional japonesa começa pelo “final” para preservar o layout e a intenção do autor.',
    image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?q=80&w=1200&auto=format&fit=crop',
    category: 'Mangá',
    tags: ['leitura','japão','cultura']
  }

]

const state = {
  items: [...INITIAL_DATA],
  filters: {
    search: '',
    category: 'Todos',
    sort: 'recent' // 'recent' | 'alpha'
  }
};


// =====================
// RENDER: CARDS
// =====================
function renderCards(){
  const row = document.getElementById('cardsRow');
  const empty = document.getElementById('emptyState');
  row.innerHTML = '';

  const filtered = sortItems(state.items.filter(matchesFilters));

  if(filtered.length === 0){
    empty.classList.remove('d-none');
    return;
  }else{
    empty.classList.add('d-none');
  }

  filtered.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card card-curio h-100 border-0';
    card.innerHTML = `
      <img src="${item.image}" class="card-img-top" alt="${item.title}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="card-title mb-0">${item.title}</h5>
          <span class="badge rounded-pill badge-cat">${item.category}</span>
        </div>
        <p class="card-text flex-grow-1">${item.text}</p>
        <div class="d-flex gap-2 flex-wrap mb-3">
          ${(item.tags||[]).map(t=>`<span class="badge text-bg-light">#${t}</span>`).join('')}
        </div>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <button class="btn btn-sm btn-outline-primary" disabled title="Curtidas na Aula 7">❤️ 0</button>
          <button class="btn btn-sm btn-outline-secondary" disabled title="Detalhes na Aula 7">Ver mais</button>
        </div>
      </div>`;

    col.appendChild(card);
    row.appendChild(col);
  });
}


// =====================
// INTERAÇÕES
// =====================
function setupInteractions(){
  // Busca
  document.getElementById('searchInput').addEventListener('input', (e)=>{
    state.filters.search = e.target.value;
    renderCards();
  });
  // Ordenação
  document.getElementById('sortSelect').addEventListener('change', (e)=>{
    state.filters.sort = e.target.value;
    renderCards();
  });
}




// =====================
// STARTUP
// =====================
document.addEventListener('DOMContentLoaded', ()=>{
  renderChips();
  setupInteractions();
  renderCards();
});


// =====================
// RENDER: CHIPS
// =====================
function renderChips(){
  const chipsEl = document.getElementById('chips');
  chipsEl.innerHTML = '';
  const categories = ['Todos', ...new Set(state.items.map(i => i.category))];

  categories.forEach(cat => {
    const span = document.createElement('span');
    span.className = 'badge rounded-pill badge-cat filter-chip px-3 py-2';
    span.textContent = cat;
    span.setAttribute('role','button');
    span.setAttribute('aria-pressed', String(cat === state.filters.category));
    span.addEventListener('click', () => {
      state.filters.category = cat;
      // atualizar aria-pressed de todos e refazer cards
      document.querySelectorAll('#chips .filter-chip').forEach(el=>{
        el.setAttribute('aria-pressed', String(el.textContent === state.filters.category));
      });
      renderCards();
    });
    chipsEl.appendChild(span);
  });
}

// =====================
// FILTRO + ORDENAÇÃO
// =====================
function matchesFilters(item){
  const search = state.filters.search.trim().toLowerCase();
  const inSearch = search === '' || [item.title, item.text, (item.tags||[]).join(' ')].join(' ').toLowerCase().includes(search);
  const inCat = state.filters.category === 'Todos' || item.category === state.filters.category;
  return inSearch && inCat;
}

function sortItems(items){
  const mode = state.filters.sort;
  if(mode === 'alpha'){
    return [...items].sort((a,b)=> a.title.localeCompare(b.title));
  }
  // 'recent' → manter ordem de inserção (itens mais novos no fim)
  return [...items];
}