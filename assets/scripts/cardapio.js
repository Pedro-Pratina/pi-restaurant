import { CartStore } from './carrinho-loja.js';

function adicionarAoCarrinho() {
  const buttons = document.querySelectorAll('.product-button');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');

        const name = card.querySelector('.product-title').textContent;
        const price = card.querySelector('.product-price data').value;
        const image = card.querySelector('.product-image').src;
        const text = btn.textContent.trim();
        console.log(text);
  
        const id = card.dataset.id;

      if(btn.classList.contains("clicked")) {
        btn.classList.remove("clicked");
        CartStore.removeItem(id);
        btn.textContent = "Adicionar";
      } else {
        btn.classList.add("clicked");
        CartStore.addItem({
          id,
          name,
          price: parseFloat(price),
          image
        });
        btn.textContent = "Remover";
      }
    });
  });
}

adicionarAoCarrinho();