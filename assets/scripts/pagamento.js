/**
 * checkout.js
 * ─────────────────────────────────────────────────────────────
 * Depende de: cart-store.js (carregado antes, expõe window.CartStore)
 *
 * PADRÕES herdados de cart-store.js / cart.js:
 *  - CartStore.getState()           → { items, subtotal, deliveryFee }
 *  - CartStore.clear()              → esvazia o carrinho e dispara cart:updated
 *  - evento 'cart:updated'          → escutado para manter o resumo sempre fresco
 *
 * OrderStore (definido aqui):
 *  - mesmo padrão IIFE + localStorage de CartStore
 *  - exposto como window.OrderStore para uso em acompanhamento.html
 *  - OrderStore.create(data)        → salva e retorna o pedido com id único
 *  - OrderStore.getById(id)         → usado em acompanhamento.html
 *  - OrderStore.getAll()            → lista todos os pedidos do usuário
 * ─────────────────────────────────────────────────────────────
 */

// ── OrderStore ────────────────────────────────────────────────
// Mesma arquitetura do CartStore: IIFE, localStorage, eventos.
import { CartStore } from '../scripts/carrinho-loja.js';


export const OrderStore = (() => {
  const STORAGE_KEY = 'nusushi_orders';

  // ── Leitura / escrita (espelho de CartStore._load/_save) ──

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function _save(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(
      new CustomEvent('orders:updated', { detail: orders })
    );
  }

  // ── API pública ────────────────────────────────────────────

  /**
   * Cria e persiste um novo pedido.
   * Recebe os dados montados pelo checkout.js e injeta id, data e status.
   *
   * @param {{
   *   items: Array,
   *   subtotal: number,
   *   deliveryFee: number,
   *   total: number,
   *   deliveryMethod: string,
   *   paymentMethod: string,
   *   address: object|null
   * }} data
   * @returns {{ id: string, createdAt: string, status: string, ...data }}
   */
  function create(data) {
    const orders = _load();
    const order = {
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'confirmado',
      ...data,
    };
    orders.unshift(order); // mais recente primeiro
    _save(orders);
    return order;
  }

  /**
   * Retorna todos os pedidos salvos.
   * @returns {Array}
   */
  function getAll() {
    return _load();
  }

  /**
   * Busca um pedido pelo id.
   * Usado em acompanhamento.html: OrderStore.getById(params.get('id'))
   * @param {string} id
   * @returns {object|null}
   */
  function getById(id) {
    return _load().find((o) => o.id === id) || null;
  }

  return { create, getAll, getById };
})();

// ── UI do Checkout ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Guarda de rota: sem itens → volta pro carrinho ──────────
  // Espelho do comportamento do Cart.js: sem itens, redireciona.
  const { items, subtotal } = CartStore.getState();
  if (items.length === 0) {
    window.location.href = 'carrinho.html';
    return;
  }

  // ── Referências DOM ─────────────────────────────────────────
  const $form         = document.getElementById('checkout-form');
  const $cardAddress  = document.getElementById('card-address');
  const $deliveryBtns = document.querySelectorAll('[data-delivery]');
  const $paymentBtns  = document.querySelectorAll('[data-payment]');
  const $orderItems   = document.getElementById('order-items');
  const $summSubtotal = document.getElementById('summ-subtotal');
  const $summDelivery = document.getElementById('summ-delivery');
  const $summTotal    = document.getElementById('summ-total');

  // ── Estado local da UI (mesmo padrão de discount em cart.js) ─
  let deliveryMethod = 'entrega';
  let paymentMethod  = 'cartao-credito';

  // ── Cálculo de frete ────────────────────────────────────────
  // Reutiliza a mesma regra de CartStore._buildState:
  // frete grátis acima de R$ 50, mas só se for entrega.
  function getDeliveryFee() {
    if (deliveryMethod === 'retirada') return 0;
    return subtotal > 50 ? 0 : 8.90;
  }

  // ── Render do resumo ────────────────────────────────────────
  // Mesmo padrão de renderSummary em cart.js: atualiza os
  // elementos do DOM sem recriar o HTML inteiro.
  function renderSummary() {
    const fee   = getDeliveryFee();
    const total = subtotal + fee;

    $summSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
    $summDelivery.textContent = fee === 0 ? 'Grátis' : `R$ ${fee.toFixed(2)}`;
    $summTotal.textContent    = `R$ ${total.toFixed(2)}`;
  }

  // ── Render dos itens do pedido ──────────────────────────────
  // Recebe os mesmos `items` de CartStore.getState(), mesmo
  // shape de objeto usado em createItemEl (cart.js).
  function renderItems() {
    $orderItems.innerHTML = '';
    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <span class="order-item__name">${item.quantity}× ${item.name}</span>
        <span class="order-item__value">R$ ${(item.price * item.quantity).toFixed(2)}</span>
      `;
      $orderItems.appendChild(div);
    });
  }

  // ── Método de entrega ────────────────────────────────────────
  $deliveryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      deliveryMethod = btn.dataset.delivery;

      // toggle visual active (mesmo padrão de qty-btn no cart.js)
      $deliveryBtns.forEach((b) => b.classList.toggle('active', b === btn));

      // mostra/esconde formulário de endereço com animação CSS
      if (deliveryMethod === 'entrega') {
        $cardAddress.classList.remove('hidden');
        $cardAddress.querySelectorAll('[data-required]').forEach((input) => {
          input.setAttribute('required', '');
        });
      } else {
        $cardAddress.classList.add('hidden');
        $cardAddress.querySelectorAll('input').forEach((input) => {
          input.removeAttribute('required');
        });
      }

      // resume sempre atualizado — mesmo padrão de render() no cart.js
      renderSummary();
    });
  });

  // ── Método de pagamento ──────────────────────────────────────
  $paymentBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      paymentMethod = btn.dataset.payment;
      $paymentBtns.forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  // ── Escuta cart:updated (disparado por CartStore._emit) ──────
  // Se por qualquer razão o carrinho mudar enquanto o checkout
  // está aberto (ex: outra aba), re-verifica e atualiza.
  window.addEventListener('cart:updated', (e) => {
    const { items: updatedItems } = e.detail;
    if (updatedItems.length === 0) {
      window.location.href = 'carrinho.html';
    } else {
      renderSummary();
    }
  });

  // ── Submit ───────────────────────────────────────────────────
  $form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fee   = getDeliveryFee();
    const total = subtotal + fee;

    // monta endereço apenas se for entrega (mesmo condicional do Checkout.tsx)
    const address = deliveryMethod === 'entrega'
      ? {
          street:       document.getElementById('addr-street').value.trim(),
          number:       document.getElementById('addr-number').value.trim(),
          complement:   document.getElementById('addr-complement').value.trim(),
          neighborhood: document.getElementById('addr-neighborhood').value.trim(),
          city:         document.getElementById('addr-city').value.trim(),
        }
      : null;

    // cria pedido via OrderStore (mesma API de CartStore)
    const order = OrderStore.create({
      items,
      subtotal,
      deliveryFee: fee,
      total,
      deliveryMethod,
      paymentMethod,
      address,
    });

    // limpa o carrinho via CartStore.clear() — dispara cart:updated
    CartStore.clear();

    // redireciona para acompanhamento com o id do pedido na query string
    // window.location.href = `acompanhamento.html?id=${order.id}`;
  });

  // ── Init ─────────────────────────────────────────────────────
  renderItems();
  renderSummary();
});
