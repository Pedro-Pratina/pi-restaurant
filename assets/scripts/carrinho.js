/**
 * cart.js
 * ─────────────────────────────────────────────────────────────
 * Depende de: cart-store.js (deve ser carregado antes)
 * ─────────────────────────────────────────────────────────────
 */
import { CartStore } from '../scripts/carrinho-loja.js';
document.addEventListener('DOMContentLoaded', () => {

  // ── Referências DOM ──────────────────────────────────────────
  const $root        = document.getElementById('cart-root');
  const $empty       = document.getElementById('cart-empty');
  const $main        = document.getElementById('cart-main');
  const $itemsList   = document.getElementById('cart-items');
  const $couponInput = document.getElementById('coupon-input');
  const $couponBtn   = document.getElementById('coupon-btn');
  const $couponMsg   = document.getElementById('coupon-msg');
  const $subtotal    = document.getElementById('summary-subtotal');
  const $delivery    = document.getElementById('summary-delivery');
  const $discountRow = document.getElementById('summary-discount-row');
  const $discountVal = document.getElementById('summary-discount');
  const $total       = document.getElementById('summary-total');
  const $shippingMsg = document.getElementById('free-shipping-msg');
  const $progressBar = document.getElementById('shipping-bar');
  const $checkoutBtn = document.getElementById('checkout-btn');

  // ── Estado local da UI ───────────────────────────────────────
  let discount = 0;

  // ── Render ───────────────────────────────────────────────────

  function render() {
    const { items, subtotal, deliveryFee } = CartStore.getState();
    console.log('Estado do carrinho:', { items, subtotal, deliveryFee, discount });
    const total = subtotal + deliveryFee - discount;

    if (items.length === 0) {
      $empty.style.display = 'flex';
      $main.style.display  = 'none';
      return;
    }

    $empty.style.display = 'none';
    $main.style.display  = 'grid';

    renderItems(items);
    renderSummary(subtotal, deliveryFee, total);
  }

  function renderItems(items) {
    $itemsList.innerHTML = '';
    items.forEach((item, i) => {
      const el = createItemEl(item);
      el.style.animationDelay = `${i * 0.06}s`;
      $itemsList.appendChild(el);
    });
  }

  function createItemEl(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.id = item.id;

    div.innerHTML = `
      <img
        class="cart-item__img"
        src="${item.image || 'https://via.placeholder.com/88x88?text=🍣'}"
        alt="${item.name}"
        onerror="this.src='https://via.placeholder.com/88x88?text=🍣'"
      />
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__unit-price">R$ ${item.price.toFixed(2)} / un.</p>
        <div class="qty-control">
          <button class="qty-btn qty-btn--minus" aria-label="Diminuir quantidade">
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-btn--plus" aria-label="Aumentar quantidade">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      <div class="cart-item__right">
        <span class="cart-item__total">R$ ${(item.price * item.quantity).toFixed(2)}</span>
        <button class="cart-item__remove" aria-label="Remover item">
          <svg viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    `;

    // eventos do item
    div.querySelector('.qty-btn--minus').addEventListener('click', () => {
      CartStore.updateQuantity(item.id, item.quantity - 1);
    });

    div.querySelector('.qty-btn--plus').addEventListener('click', () => {
      CartStore.updateQuantity(item.id, item.quantity + 1);
    });

    div.querySelector('.cart-item__remove').addEventListener('click', () => {
      div.style.transition = 'opacity 0.2s, transform 0.2s';
      div.style.opacity    = '0';
      div.style.transform  = 'translateX(20px)';
      setTimeout(() => CartStore.removeItem(item.id), 200);
    });

    return div;
  }

  function renderSummary(subtotal, deliveryFee, total) {
    $subtotal.textContent  = `R$ ${subtotal.toFixed(2)}`;
    $delivery.textContent  = deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`;
    $total.textContent     = `R$ ${total.toFixed(2)}`;

    if (discount > 0) {
      $discountRow.style.display = 'flex';
      $discountVal.textContent   = `- R$ ${discount.toFixed(2)}`;
    } else {
      $discountRow.style.display = 'none';
    }

    // barra de progresso frete grátis (meta: R$ 50)
    const pct = Math.min((subtotal / 50) * 100, 100);
    $progressBar.style.width = `${pct}%`;

    if (subtotal >= 50) {
      $shippingMsg.textContent = '🎉 Você ganhou frete grátis!';
    } else {
      $shippingMsg.textContent = `Faltam R$ ${(50 - subtotal).toFixed(2)} para frete grátis`;
    }
  }

  // ── Cupom ────────────────────────────────────────────────────

  function applyCoupon() {
    const code = $couponInput.value.trim().toUpperCase();
    const { subtotal } = CartStore.getState();

    const COUPONS = {
      'PRIMEIRACOMPRA': 0.10,
      'SAKURA10':       0.10,
      'DESCONTO20':     0.20,
    };

    if (COUPONS[code]) {
      discount = subtotal * COUPONS[code];
      $couponMsg.textContent = `✓ Cupom aplicado! ${(COUPONS[code] * 100).toFixed(0)}% de desconto`;
      $couponMsg.className   = 'coupon-msg';
    } else {
      discount = 0;
      $couponMsg.textContent = 'Cupom inválido ou expirado.';
      $couponMsg.className   = 'coupon-msg error';
    }

    render();
  }

  $couponBtn.addEventListener('click', applyCoupon);
  $couponInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyCoupon();
  });

  // ── Checkout ─────────────────────────────────────────────────

  $checkoutBtn.addEventListener('click', () => {
    // Aqui você navegaria para /checkout ou abre um modal.
    // O CartStore continua disponível lá via localStorage.
    alert('Redirecionando para o checkout...\n\nEm produção: window.location.href = "/checkout"');
  });

  // ── Reage a mudanças externas (ex: cardápio adicionando itens) ─
  window.addEventListener('cart:updated', () => render());

  // ── Init ─────────────────────────────────────────────────────
  render();
});

const btnLimpar = document.getElementById('limpar-carrinho');
btnLimpar.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    CartStore.clear()
  }
});