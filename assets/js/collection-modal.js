// Reuse the original product modal and cart on the current collection page.
Store.setupEventListeners();
Store.filterCategory = () => {};
function syncCollectionProducts() {
  Store.products = [...Store.products.filter(p => !products.some(x => x.id === p.id)), ...products.map(p => ({...p, basePrice:p.price, price:MaelleBlackFriday.price(p), bfActive:MaelleBlackFriday.eligible(p)}))];
  Store.updateCartUI();
}
document.getElementById('grid').addEventListener('click', event => {
  const link = event.target.closest('a[href^="#produto="]');
  if (!link) return;
  event.preventDefault();
  const id = decodeURIComponent(link.getAttribute('href').slice(9));
  syncCollectionProducts();
  const product = Store.products.find(p => String(p.id) === id);
  if (product) Store.openPDP(product.id);
});
document.querySelector('.mh-actions a[aria-label="Carrinho"]')?.addEventListener('click', event => {
  event.preventDefault(); syncCollectionProducts(); Store.openCart();
});
