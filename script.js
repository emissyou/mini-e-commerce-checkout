const products = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    price: 79990,
    img: "https://www.apple.com/v/iphone/home/ci/images/overview/select/iphone_17pro__0s6piftg70ym_large.jpg",
  },
  {
    id: 2,
    name: "iPhone 17",
    price: 69990,
    img: "https://www.apple.com/ph/iphone/home/images/overview/select/iphone_17__ck7zzemcw37m_large.jpg",
  },
  {
    id: 3,
    name: "iPhone 16 Pro",
    price: 64990,
    img: "https://www.apple.com/ph/iphone/home/images/overview/select/iphone_16__drr03yfz644m_large.jpg",
  },
  {
    id: 4,
    name: "iPhone 16",
    price: 54990,
    img: "https://www.apple.com/ph/iphone/home/images/overview/select/iphone_16__drr03yfz644m_large.jpg",
  },
  {
    id: 5,
    name: "iPhone 15 Pro",
    price: 49990,
    img: "https://www.apple.com/v/iphone/home/ci/images/overview/select/iphone_air__f0t56fef3oey_large.jpg",
  },
  {
    id: 6,
    name: "iPhone 15",
    price: 42990,
    img: "https://www.apple.com/ph/iphone/home/images/overview/select/iphone_16e__dar81seif0cy_large.jpg",
  },
];

let cart = [];

/* Render Products */
function renderProducts() {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card product-card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5>${p.name}</h5>
            <p class="text-muted small">${p.category}</p>
            <div class="mt-auto">
              <p class="fw-bold fs-5">₱${p.price.toLocaleString()}</p>
              <button
                onclick="addToCart(${p.id})"
                class="btn btn-danger w-100">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* Cart Functions */
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const item = cart.find((i) => i.id === id);

  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });

  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cartTableBody");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          Your cart is empty
        </td>
      </tr>`;
    document.getElementById("cartCount").textContent = 0;
    updateTotals();
    return;
  }

  cart.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td><img src="${item.img}"></td>
        <td>${item.name}</td>
        <td class="text-end">₱${item.price.toLocaleString()}</td>
        <td class="text-center">
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-outline-danger"
              onclick="updateQty(${item.id}, ${item.qty - 1})">-</button>
            <span>${item.qty}</span>
            <button class="btn btn-sm btn-outline-danger"
              onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
          </div>
        </td>
        <td class="text-end fw-bold">
          ₱${(item.price * item.qty).toLocaleString()}
        </td>
        <td>
          <button class="btn btn-sm btn-danger"
            onclick="removeItem(${item.id})">×</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("cartCount").textContent = cart.length;
  updateTotals();
}

function updateQty(id, qty) {
  if (qty < 1) return removeItem(id);
  cart.find((i) => i.id === id).qty = qty;
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function clearCart() {
  if (confirm("Clear cart?")) {
    cart = [];
    renderCart();
  }
}

/* Totals */
function updateTotals() {
  let subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let tax = Math.round(subtotal * 0.12);
  let total = subtotal + tax;

  document.getElementById("summaryCard").innerHTML = `
    <div class="card-body">
      <h5 class="mb-3">Order Summary</h5>
      <div class="d-flex justify-content-between">
        <span>Subtotal</span>
        <span>₱${subtotal.toLocaleString()}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span>Tax (12%)</span>
        <span>₱${tax.toLocaleString()}</span>
      </div>
      <hr>
      <div class="d-flex justify-content-between fw-bold fs-5">
        <span>Total</span>
        <span>₱${total.toLocaleString()}</span>
      </div>
    </div>
  `;

  document.getElementById("grandTotalBtn").textContent = total.toLocaleString();
}

/* Place Order */
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Order placed successfully!\nThank you for shopping with Shoffy.");
  cart = [];
  renderCart();
}

window.onload = () => {
  renderProducts();
  renderCart();
};
