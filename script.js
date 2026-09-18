// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));
}

// Promo
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');
if (promoClose && promoBanner) {
  if (sessionStorage.getItem('promoClosed')) promoBanner.style.display = 'none';
  promoClose.addEventListener('click', () => {
    promoBanner.style.display = 'none';
    sessionStorage.setItem('promoClosed', '1');
  });
}

// Filters + search
function getActiveFilter() {
  return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
}
function filterProducts(category, query) {
  document.querySelectorAll('.product-card').forEach(card => {
    const cat = card.dataset.category || '';
    const name = (card.dataset.name || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    const matchCat = category === 'all' || cat === category;
    const matchQ = !query || name.includes(query) || text.includes(query);
    card.classList.toggle('hidden', !(matchCat && matchQ));
  });
}
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const q = (document.getElementById('productSearch')?.value || '').toLowerCase().trim();
    filterProducts(btn.dataset.filter, q);
  });
});
const searchInput = document.getElementById('productSearch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    filterProducts(getActiveFilter(), searchInput.value.toLowerCase().trim());
  });
}

// Popular cards scroll to filter
document.querySelectorAll('.popular-card[data-scroll-filter]').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const f = card.dataset.scrollFilter;
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === f);
    });
    filterProducts(f, '');
    if (searchInput) searchInput.value = '';
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Hero slides
const slides = document.querySelectorAll('.hero-slide');
let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 4500);
}

// Qty
document.querySelectorAll('.qty-wrap').forEach(wrap => {
  const input = wrap.querySelector('.qty-input');
  wrap.querySelector('.qty-minus')?.addEventListener('click', () => {
    input.value = Math.max(1, parseInt(input.value || '1') - 1);
  });
  wrap.querySelector('.qty-plus')?.addEventListener('click', () => {
    input.value = Math.min(9999, parseInt(input.value || '1') + 1);
  });
});

// Cart
let cart = JSON.parse(localStorage.getItem('devkiCart') || '[]');
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartBody = document.getElementById('cartBody');
const cartCount = document.getElementById('cartCount');
const cartCheckout = document.getElementById('cartCheckout');
const cartClear = document.getElementById('cartClear');

function saveCart() {
  localStorage.setItem('devkiCart', JSON.stringify(cart));
  updateCartUI();
}
function updateCartUI() {
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  if (cartCount) cartCount.textContent = total;
  if (!cartBody) return;
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (cartCheckout) cartCheckout.href = 'https://wa.me/254102899955?text=Hello%20Devki%20Steel';
  } else {
    cartBody.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>Qty: ${item.qty}</span>
        </div>
        <button class="cart-item-remove" data-index="${i}">Remove</button>
      </div>`).join('');
    cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(+btn.dataset.index, 1);
        saveCart();
      });
    });
    const lines = cart.map((item, i) => `${i + 1}. ${item.name} × ${item.qty}`);
    const msg = 'Hello Devki Steel, I would like to order:%0A%0A' + lines.join('%0A') + '%0A%0APlease confirm availability and total.';
    if (cartCheckout) cartCheckout.href = `https://wa.me/254102899955?text=${msg}`;
  }
}
function openCart() {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
}
function closeCart() {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
}
cartBtn?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);
cartClear?.addEventListener('click', () => { cart = []; saveCart(); });

document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.add;
    const row = btn.closest('.add-row');
    const qty = Math.max(1, parseInt(row?.querySelector('.qty-input')?.value || '1') || 1);
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += qty;
    else cart.push({ name, qty });
    saveCart();
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1200);
  });
});
updateCartUI();

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Enquiry form → WhatsApp
document.getElementById('inquiryForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('inqName').value.trim();
  const phone = document.getElementById('inqPhone').value.trim();
  const product = document.getElementById('inqProduct').value || 'General enquiry';
  const details = document.getElementById('inqQty').value.trim();
  let msg = `Hello Devki Steel,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AProduct: ${encodeURIComponent(product)}`;
  if (details) msg += `%0ADetails: ${encodeURIComponent(details)}`;
  msg += '%0A%0APlease assist with a quote.';
  window.open(`https://wa.me/254102899955?text=${msg}`, '_blank');
});

// Open status
function updateOpenStatus() {
  const el = document.getElementById('openStatus');
  if (!el) return;
  const now = new Date();
  const day = now.getDay();
  const t = now.getHours() * 60 + now.getMinutes();
  let open = false;
  if (day >= 1 && day <= 5) open = t >= 480 && t < 1020;
  else if (day === 6) open = t >= 540 && t < 840;
  else if (day === 0) open = t >= 600 && t < 780;
  el.textContent = open ? '● Open now' : '● Closed now — see hours above';
  el.className = 'hours-note ' + (open ? 'open' : 'closed');
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);
