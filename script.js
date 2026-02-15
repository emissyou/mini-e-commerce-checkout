// ======= DATA =======
const products = [
  { id: "v-talong", name: "Talong", price: 50, category: "Vegetable" },
  { id: "v-ampalaya", name: "Ampalaya", price: 35, category: "Vegetable" },
  { id: "v-okra", name: "Okra", price: 40, category: "Vegetable" },
  { id: "f-papaya", name: "Papaya", price: 150, category: "Fruit" },
  { id: "f-saging", name: "Saging", price: 90, category: "Fruit" },
  { id: "f-mangga", name: "Mangga", price: 95, category: "Fruit" },
  { id: "s-piattos", name: "Piattos", price: 30, category: "Snack" },
  { id: "s-tahoos", name: "Tahoos", price: 20, category: "Snack" },
  { id: "s-nova", name: "Nova", price: 30, category: "Snack" },
];

let cart = [];
let activeCategory = "all"; // remember selected category

// ======= HELPER FUNCTIONS =======
function formatCurrency(amount) {
  return "₱" + amount.toFixed(2);
}

function calculateCart() {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.qty;
  });
  let discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
  let tax = (subtotal - discount) * 0.12;
  let shipping = subtotal >= 500 ? 0 : 80;
  let grandTotal = subtotal - discount + tax + shipping;
  return { subtotal, discount, tax, shipping, grandTotal };
}

// ======= CATEGORY FILTER =======
function filterCategory(category) {
  activeCategory = category; // store active category

  const vegetables = document.querySelector(".vegetable");
  const fruits = document.querySelector(".fruits");
  const snacks = document.querySelector(".snacks");

  vegetables.style.display =
    category === "all" || category === "vegetable" ? "flex" : "none";
  fruits.style.display =
    category === "all" || category === "fruit" ? "flex" : "none";
  snacks.style.display =
    category === "all" || category === "snack" ? "flex" : "none";
}

// Setup category links
const categories = ["all", "vegetable", "fruit", "snack"];
categories.forEach((cat) => {
  const link = document.getElementById(cat);
  link.addEventListener("click", (e) => {
    e.preventDefault();
    filterCategory(cat);
  });
});

// Initial filter
filterCategory(activeCategory);

// ======= CART RENDER & UPDATE =======
function renderCart() {
  const container = document.querySelector(".item-container");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-items";
      row.innerHTML = `
        <div>${item.name}</div>
        <div>
          <button class="minus">-</button>
          <input type="number" min="1" value="${item.qty}">
          <button class="plus">+</button>
        </div>
        <div>${formatCurrency(item.price)}</div>
        <div>${formatCurrency(item.price * item.qty)}</div>
        <div><button class="remove">Remove</button></div>
      `;
      container.appendChild(row);

      row.querySelector(".plus").addEventListener("click", () => {
        item.qty++;
        updateCart();
      });
      row.querySelector(".minus").addEventListener("click", () => {
        if (item.qty > 1) item.qty--;
        updateCart();
      });
      row.querySelector("input").addEventListener("change", (e) => {
        let val = parseInt(e.target.value);
        if (val < 1 || isNaN(val)) val = 1;
        item.qty = val;
        updateCart();
      });
      row.querySelector(".remove").addEventListener("click", () => {
        cart = cart.filter((i) => i.id !== item.id);
        updateCart();
      });
    });
  }

  // Cart summary
  const summary = calculateCart();
  const summaryDiv = document.querySelector(".cart-summary");
  summaryDiv.innerHTML = `
    <div>Subtotal: ${formatCurrency(summary.subtotal)}</div>
    <div>Discount: ${formatCurrency(summary.discount)}</div>
    <div>Tax: ${formatCurrency(summary.tax)}</div>
    <div>Shipping fee: ${formatCurrency(summary.shipping)}</div>
    <hr />
    <div>Grand Total: ${formatCurrency(summary.grandTotal)} <button id="checkout-btn">Check Out</button></div>
  `;

  document
    .getElementById("checkout-btn")
    ?.addEventListener("click", showCheckoutForm);
}

// Update cart while keeping category
function updateCart() {
  renderCart();
  filterCategory(activeCategory);
}

// ======= ADD TO CART =======
products.forEach((product) => {
  document.getElementById(product.id).addEventListener("click", () => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCart();
  });
});

// ======= CART TOGGLE =======
const cartContainer = document.querySelector(".cart-container");
const cartButton = document.querySelector(".nav button");
const backButton = document.querySelector(".cart-container .back");

// toggle cart
cartButton.addEventListener("click", () => {
  cartContainer.classList.toggle("show");
});

// hide cart when back button clicked
backButton.addEventListener("click", () => {
  cartContainer.classList.remove("show");
});

cartButton.addEventListener("click", () => {
  if (cartContainer.style.transform === "translateX(0px)") {
    cartContainer.style.transform = "translateX(100%)";
  } else {
    cartContainer.style.transform = "translateX(0px)";
  }
});

backButton.addEventListener("click", () => {
  cartContainer.style.transform = "translateX(100%)";
});

// ======= CHECKOUT FORM =======
function showCheckoutForm() {
  // Create modal dynamically
  let modal = document.createElement("div");
  modal.className = "modal fade";
  modal.tabIndex = -1;
  modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content p-3">
        <div class="modal-header">
            <h5 class="modal-title">Checkout</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="checkout-form">
            <div class="mb-3">
                <label>Full Name</label>
                <input type="text" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Email</label>
                <input type="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label>Payment Method</label>
                <select class="form-control" required>
                <option value="">Select</option>
                <option>Cash</option>
                <option>GCash</option>
                <option>Card</option>
                </select>
            </div>
            <div class="mb-3">
                <label>Delivery Option</label>
                <select class="form-control" id="delivery-option" required>
                <option value="">Select</option>
                <option value="Pickup">Pickup</option>
                <option value="Delivery">Delivery</option>
                </select>
            </div>
            <div class="mb-3" id="address-field" style="display:none;">
                <label>Address</label>
                <input type="text" class="form-control">
            </div>
            <button type="submit" class="btn btn-success">Place Order</button>
            </form>
        </div>
        </div>
    </div>
    `;
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  const deliverySelect = modal.querySelector("#delivery-option");
  const addressField = modal.querySelector("#address-field input");
  deliverySelect.addEventListener("change", () => {
    if (deliverySelect.value === "Delivery") {
      addressField.required = true;
      addressField.parentElement.style.display = "block";
    } else {
      addressField.required = false;
      addressField.parentElement.style.display = "none";
    }
  });

  modal.querySelector("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    bsModal.hide();
    modal.remove();
    showReceipt(form);
    cart = [];
    updateCart();
  });
}

// ======= RECEIPT =======
function showReceipt(form) {
  const summary = calculateCart();
  const orderId = `ORD-2026-${Math.floor(Math.random() * 900000 + 100000)}`;
  const now = new Date();
  let itemsHTML = cart
    .map(
      (i) => `<tr>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${formatCurrency(i.price)}</td>
        <td>${formatCurrency(i.price * i.qty)}</td>
    </tr>`,
    )
    .join("");

  let modal = document.createElement("div");
  modal.className = "modal fade";
  modal.tabIndex = -1;
  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
        <div class="modal-content p-3">
        <div class="modal-header">
            <h5 class="modal-title">Receipt</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="receipt">
            <p>Order ID: ${orderId}</p>
            <p>Date: ${now.toLocaleString()}</p>
            <p>Customer: ${form[0].value}</p>
            <p>Email: ${form[1].value}</p>
            <p>Payment Method: ${form[2].value}</p>
            <p>Delivery Option: ${form[3].value}</p>
            ${form[3].value === "Delivery" ? `<p>Address: ${form[4].value}</p>` : ""}
            <table class="table">
            <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
            </table>
            <p>Subtotal: ${formatCurrency(summary.subtotal)}</p>
            <p>Discount: ${formatCurrency(summary.discount)}</p>
            <p>Tax: ${formatCurrency(summary.tax)}</p>
            <p>Shipping: ${formatCurrency(summary.shipping)}</p>
            <hr>
            <p>Grand Total: ${formatCurrency(summary.grandTotal)}</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" id="print-receipt">Print Receipt</button>
        </div>
        </div>
    </div>
    `;
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  modal.querySelector("#print-receipt").addEventListener("click", () => {
    const receiptContent = modal.querySelector("#receipt").innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = receiptContent;
    window.print();
    document.body.innerHTML = original;
    location.reload();
  });

  modal.addEventListener("hidden.bs.modal", () => modal.remove());
}

// Initial render
renderCart();
