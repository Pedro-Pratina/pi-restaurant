// Seleciona os elementos
const searchInput  = document.querySelector('.search-input');
const categoryBtns = document.querySelectorAll('.category-button');
const productCards = document.querySelectorAll('.product-card');

let currentCategory = 'Todos';
let currentSearch   = '';

// Filtra os cards com base na categoria e no texto de busca
function filterCards() {
  productCards.forEach(card => {
    const title       = card.querySelector('.product-title').textContent.toLowerCase();
    const description = card.querySelector('.product-description').textContent.toLowerCase();
    const category    = card.dataset.category || '';

    const matchesSearch   = title.includes(currentSearch) || description.includes(currentSearch);
    const matchesCategory = currentCategory === 'Todos' || category === currentCategory;

    card.style.display = matchesSearch && matchesCategory ? '' : 'none';
  });
}

// Busca
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value.toLowerCase().trim();
  filterCards();
});

// Filtros de categoria
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualiza estado visual dos botões
    categoryBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    currentCategory = btn.textContent.trim();
    filterCards();
  });
});