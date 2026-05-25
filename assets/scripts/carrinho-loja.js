/**
 * cart-store.js
 * ─────────────────────────────────────────────────────────────
 * Gerenciamento de estado do carrinho via localStorage.
 * Qualquer página importa este arquivo e usa o CartStore global.
 *
 * COMO USAR EM OUTRAS PÁGINAS (ex: cardápio):
 *   CartStore.addItem({ id: '1', name: 'Temaki', price: 24.90, image: 'img.jpg' });
 *
 * EVENTOS CUSTOMIZADOS:
 *   window.addEventListener('cart:updated', (e) => {
 *     console.log(e.detail); // estado completo do carrinho
 *   });
 * ─────────────────────────────────────────────────────────────
 */

export const CartStore = (() => {
  const STORAGE_KEY = 'nusushi_cart';

  // ── Leitura / escrita ──────────────────────────────────────

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function _save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    _emit(items);
  }

  function _emit(items) {
    window.dispatchEvent(
      new CustomEvent('cart:updated', { detail: _buildState(items) })
    );
  }

  // ── Estado derivado ────────────────────────────────────────

  function _buildState(items) {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 50 ? 0 : 8.9;
    return { items, subtotal, deliveryFee };
  }

  // ── API pública ────────────────────────────────────────────

  /**
   * Retorna o estado atual do carrinho.
   * @returns {{ items: Array, subtotal: number, deliveryFee: number }}
   */
  function getState() {
    return _buildState(_load());
  }

  /**
   * Adiciona um produto. Se já existir, incrementa a quantidade.
   * @param {{ id: string, name: string, price: number, image?: string }} product
   * @param {number} [qty=1]
   */
  function addItem(product, qty = 1) {
    const items = _load();
    const idx = items.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      items[idx].quantity += qty;
    } else {
      items.push({ ...product, quantity: qty });
    }
    _save(items);
  }

  /**
   * Define a quantidade exata de um item.
   * Se qty <= 0, remove o item.
   * @param {string} id
   * @param {number} qty
   */
  function updateQuantity(id, qty) {
    let items = _load();
    if (qty <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      const idx = items.findIndex((i) => i.id === id);
      if (idx > -1) items[idx].quantity = qty;
    }
    _save(items);
  }

  /**
   * Remove um item pelo id.
   * @param {string} id
   */
  function removeItem(id) {
    _save(_load().filter((i) => i.id !== id));
  }

  /**
   * Esvazia o carrinho.
   */
  function clear() {
    _save([]);
  }

  return { getState, addItem, updateQuantity, removeItem, clear };
})();