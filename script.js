// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Hero slideshow
const slides = document.querySelectorAll('.hero-slide');
let slideIndex = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 4500);
}

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
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Add products to order.</p>';
    cartCheckout.href = 'https://wa.me/254102899955?text=Hello%20Devki%20Steel';
  } else {
    cartBody.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item}</strong>
        </div>
        <button class="cart-item-remove" data-index="${i}">Remove</button>
      </div>
    `).join('');
    cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index), 1);
        saveCart();
      });
    });
    const msg = 'Hello Devki Steel, I would like to order:%0A%0A' +
      cart.map((item, i) => `${i + 1}. ${item}`).join('%0A') +
      '%0A%0APlease confirm availability and total.';
    cartCheckout.href = `https://wa.me/254102899955?text=${msg}`;
  }
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
cartClear.addEventListener('click', () => {
  cart = [];
  saveCart();
});

document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.dataset.add;
    cart.push(item);
    saveCart();
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 1500);
  });
});

updateCartUI();
