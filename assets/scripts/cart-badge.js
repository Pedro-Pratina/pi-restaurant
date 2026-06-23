import { CartStore } from './carrinho-loja.js';

// Busca pelo primeiro link dentro de .nav_icons (sempre o carrinho)
const cartLink = document.querySelector('.nav_icons a');

if (!cartLink) {
  console.warn('cart-badge: link do carrinho não encontrado');
} else {
  const badge = document.createElement('span');
  badge.className = 'cart-badge';
  cartLink.appendChild(badge);

  function updateBadge() {
    const { items } = CartStore.getState();
    const total = items.reduce((sum, item) => sum + item.quantity, 0);

    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';

    // Reinicia animação de pulso
    badge.classList.remove('cart-badge--pulse');
    void badge.offsetWidth;
    badge.classList.add('cart-badge--pulse');
  }

  window.addEventListener('cart:updated', updateBadge);
  updateBadge();
}