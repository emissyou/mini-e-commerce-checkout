// ===== PRODUCT DATA =====
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
    img: "https://www.apple.com/ph/iphone/home/images/overview/select/iphone_16pro__c5l7pipnf4uq_large.jpg",
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
let currentSearch = "";

// ===== RENDER PRODUCTS =====
function renderProducts(searchTerm = "") {
  const container = document.getElementById("productList");
  const noResults = document.getElementById("noResults");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filtered.length === 0) {
    container.innerHTML = "";
    noResults.classList.remove("d-none");
    return;
  }

  noResults.classList.add("d-none");
  container.innerHTML = filtered
    .map(
      (p) => `
    <div class="col-sm-6 col-md-6 col-lg-4 col-xl-3">
      <div class="card product-card">
        <div class="card-img-container">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
        </div>
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <div class="card-price">₱${p.price.toLocaleString()}</div>
          <button onclick="addToCart(${p.id})" class="btn btn-add-to-cart">
            <i class="bi bi-cart-plus me-2"></i>Add to Cart
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ===== SEARCH FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderProducts(currentSearch);
  });
});

// ===== CART FUNCTIONS =====
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const item = cart.find((i) => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showNotification(`${product.name} added to cart!`);
}

function updateQty(id, qty) {
  if (qty < 1) return removeItem(id);
  const item = cart.find((i) => i.id === id);
  item.qty = qty;
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    renderCart();
  }
}

// ===== RENDER CART =====
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const cartCount = document.getElementById("cartCount");
  const cartBadge = document.getElementById("cartBadge");

  cartCount.textContent = cart.length;
  cartBadge.textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-cart-x"></i>
        <h5>Your cart is empty</h5>
        <p>Add some products to get started!</p>
      </div>
    `;
    cartSummary.innerHTML = "";
    return;
  }

  // Render cart items
  cartItems.innerHTML = `
    <table class="table cart-table">
      <thead>
        <tr>
          <th></th>
          <th>Product</th>
          <th class="text-end">Price</th>
          <th class="text-center">Qty</th>
          <th class="text-end">Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart
          .map(
            (item) => `
          <tr>
            <td><img src="${item.img}" alt="${item.name}"></td>
            <td class="product-name">${item.name}</td>
            <td class="text-end">₱${item.price.toLocaleString()}</td>
            <td>
              <div class="qty-controls">
                <button class="btn btn-sm btn-outline-danger qty-btn" onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
                <span class="fw-bold">${item.qty}</span>
                <button class="btn btn-sm btn-outline-danger qty-btn" onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
              </div>
            </td>
            <td class="text-end fw-bold">₱${(item.price * item.qty).toLocaleString()}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Discount: 10% if subtotal >= 100000
  let discount = 0;
  let discountText = "";
  if (subtotal >= 100000) {
    discount = Math.round(subtotal * 0.1);
    discountText = "10% discount (₱100k+)";
  }

  const afterDiscount = subtotal - discount;
  const tax = Math.round(afterDiscount * 0.12);

  // Shipping: Free if subtotal >= 50000, else ₱200
  let shipping = 0;
  let shippingText = "FREE";
  if (subtotal < 50000) {
    shipping = 200;
    shippingText = "₱200";
  } else {
    shippingText = "FREE (₱50k+)";
  }

  const grandTotal = afterDiscount + tax + shipping;

  // Render summary
  cartSummary.innerHTML = `
    <div class="summary-card">
      <div class="summary-row">
        <span>Subtotal</span>
        <span class="fw-bold">₱${subtotal.toLocaleString()}</span>
      </div>
      ${
        discount > 0
          ? `
        <div class="summary-row discount">
          <span>Discount (${discountText})</span>
          <span>−₱${discount.toLocaleString()}</span>
        </div>
      `
          : ""
      }
      <div class="summary-row">
        <span>Tax (12%)</span>
        <span>₱${tax.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${shippingText}</span>
      </div>
      <div class="summary-row total">
        <span>Grand Total</span>
        <span>₱${grandTotal.toLocaleString()}</span>
      </div>
    </div>
    <button class="btn btn-place-order" onclick="openCheckout()">
      <i class="bi bi-bag-check me-2"></i>Place Order • ₱${grandTotal.toLocaleString()}
    </button>
    <button class="btn btn-outline-danger btn-clear-cart" onclick="clearCart()">
      <i class="bi bi-trash me-2"></i>Clear Cart
    </button>
  `;
}

// ===== CART TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cartToggleBtn").addEventListener("click", () => {
    document.getElementById("cartSlide").classList.toggle("show");
  });
});

// ===== CHECKOUT =====
function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const modal = new bootstrap.Modal(document.getElementById("checkoutModal"));
  modal.show();
}

// Show/hide address field based on delivery option
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("deliveryOption").addEventListener("change", (e) => {
    const addressGroup = document.getElementById("addressGroup");
    const addressField = document.getElementById("address");

    if (e.target.value === "Delivery") {
      addressGroup.classList.remove("d-none");
      addressField.setAttribute("required", "required");
    } else {
      addressGroup.classList.add("d-none");
      addressField.removeAttribute("required");
    }
  });
});

// Confirm order
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirmOrderBtn").addEventListener("click", () => {
    const form = document.getElementById("checkoutForm");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Generate order
    const orderID = `ORD-2026-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
    const customerName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const deliveryOption = document.getElementById("deliveryOption").value;
    const address = document.getElementById("address").value;

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;
    let discountText = "";
    if (subtotal >= 100000) {
      discount = Math.round(subtotal * 0.1);
      discountText = "10% discount (₱100k+)";
    }
    const afterDiscount = subtotal - discount;
    const tax = Math.round(afterDiscount * 0.12);
    let shipping = subtotal >= 50000 ? 0 : 200;
    const grandTotal = afterDiscount + tax + shipping;

    // Generate receipt
    const receiptHTML = `
      <div class="receipt-container">
        <div class="receipt-header">
          <div class="receipt-logo">Shoffy</div>
          <p class="mb-0">Davao, Philippines</p>
        </div>

        <div class="receipt-info">
          <div class="receipt-info-row">
            <strong>Order ID:</strong>
            <span>${orderID}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Date:</strong>
            <span>${new Date().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Customer:</strong>
            <span>${customerName}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Email:</strong>
            <span>${email}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Payment:</strong>
            <span>${paymentMethod}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Delivery:</strong>
            <span>${deliveryOption}${deliveryOption === "Delivery" ? " - " + address : ""}</span>
          </div>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="text-center">Qty</th>
              <th class="text-end">Price</th>
              <th class="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td class="text-center">${item.qty}</td>
                <td class="text-end">₱${item.price.toLocaleString()}</td>
                <td class="text-end">₱${(item.price * item.qty).toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="receipt-summary">
          <div class="receipt-info-row">
            <strong>Subtotal:</strong>
            <span>₱${subtotal.toLocaleString()}</span>
          </div>
          ${
            discount > 0
              ? `
            <div class="receipt-info-row" style="color: #059669;">
              <strong>Discount (${discountText}):</strong>
              <span>−₱${discount.toLocaleString()}</span>
            </div>
          `
              : ""
          }
          <div class="receipt-info-row">
            <strong>Tax (12%):</strong>
            <span>₱${tax.toLocaleString()}</span>
          </div>
          <div class="receipt-info-row">
            <strong>Shipping:</strong>
            <span>${shipping === 0 ? "FREE" : "₱" + shipping.toLocaleString()}</span>
          </div>
          <hr>
          <div class="receipt-info-row" style="font-size: 1.25rem; color: #dc2626;">
            <strong>Grand Total:</strong>
            <strong>₱${grandTotal.toLocaleString()}</strong>
          </div>
        </div>

        <div class="text-center mt-4" style="color: #6b7280; font-size: 0.9rem;">
          <p class="mb-1">Thank you for your order!</p>
          <p class="mb-0">For inquiries, contact us at support@shoffy.ph</p>
        </div>
      </div>
    `;

    document.getElementById("receiptContent").innerHTML = receiptHTML;

    // Close checkout modal and show receipt modal
    bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal"),
    ).hide();
    const receiptModal = new bootstrap.Modal(
      document.getElementById("receiptModal"),
    );
    receiptModal.show();

    // Clear cart and reset form
    cart = [];
    renderCart();
    form.reset();
    form.classList.remove("was-validated");
  });
});

// Print receipt
function printReceipt() {
  window.print();
}

// Notification
function showNotification(message) {
  const badge = document.getElementById("cartBadge");
  badge.style.transform = "scale(1.3)";
  setTimeout(() => {
    badge.style.transform = "scale(1)";
  }, 200);
}

// ===== INITIALIZE =====
window.onload = () => {
  renderProducts();
  renderCart();
};
