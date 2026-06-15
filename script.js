const bundles = {
  single: {
    key: "single",
    title: "Single Pack",
    shortTitle: "Single Pack",
    description: "A simple start for everyday pet laundry.",
    price: 24.95,
    shipping: "Add A$38.05 more for free shipping",
  },
  family: {
    key: "family",
    title: "PawWash\u2122 Family Pack",
    shortTitle: "Family Pack",
    description: "For Homes With One Very Fluffy Best Friend.",
    price: 39.95,
    shipping: "Add A$23.05 more for free shipping",
  },
  complete: {
    key: "complete",
    title: "PawWash\u2122 Complete Laundry Kit",
    shortTitle: "Complete Kit",
    description: "Everything You Need For A Cleaner Pet Home.",
    price: 49.95,
    shipping: "Add A$13.05 more for free shipping",
  },
};

const state = {
  selectedBundle: "family",
  quantity: 1,
  cart: [],
};

const selectors = {
  bundleButtons: document.querySelectorAll("[data-bundle]"),
  selectedTitle: document.querySelector("[data-selected-title]"),
  selectedDescription: document.querySelector("[data-selected-description]"),
  selectedPrice: document.querySelector("[data-selected-price]"),
  shippingMessage: document.querySelector("[data-shipping-message]"),
  qtyOutput: document.querySelector("[data-qty-output]"),
  qtyMinus: document.querySelector("[data-qty-minus]"),
  qtyPlus: document.querySelector("[data-qty-plus]"),
  addToCart: document.querySelector("[data-add-to-cart]"),
  stickyAdd: document.querySelector("[data-sticky-add]"),
  cartDrawer: document.querySelector(".cart-drawer"),
  cartTriggers: document.querySelectorAll("[data-cart-trigger]"),
  closeCart: document.querySelector("[data-close-cart]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartEmpty: document.querySelector("[data-cart-empty]"),
  subtotal: document.querySelector("[data-subtotal]"),
  cartCount: document.querySelector("[data-cart-count]"),
  toast: document.querySelector("[data-toast]"),
  languageSelect: document.querySelector("#language-select"),
};

function formatAud(value) {
  return `A$${value.toFixed(2)}`;
}

function selectedBundle() {
  return bundles[state.selectedBundle] || bundles.complete;
}

function showToast(message) {
  if (!selectors.toast) {
    return;
  }

  selectors.toast.textContent = message;
  selectors.toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    selectors.toast.classList.remove("is-visible");
  }, 2600);
}

function updateBundleUI() {
  const bundle = selectedBundle();

  selectors.bundleButtons.forEach((button) => {
    const isSelected = button.dataset.bundle === bundle.key;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (selectors.selectedTitle) {
    selectors.selectedTitle.textContent = bundle.title;
  }

  if (selectors.selectedDescription) {
    selectors.selectedDescription.textContent = bundle.description;
  }

  if (selectors.selectedPrice) {
    selectors.selectedPrice.textContent = formatAud(bundle.price);
  }

  if (selectors.shippingMessage) {
    selectors.shippingMessage.textContent = bundle.shipping;
  }

  if (selectors.qtyOutput) {
    selectors.qtyOutput.textContent = String(state.quantity);
  }

  if (selectors.stickyAdd) {
    selectors.stickyAdd.querySelector("span").textContent = bundle.shortTitle;
    selectors.stickyAdd.querySelector("strong").textContent = formatAud(bundle.price);
  }
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function cartQuantity() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
  if (!selectors.cartItems || !selectors.cartEmpty || !selectors.subtotal) {
    return;
  }

  selectors.cartItems.innerHTML = "";
  selectors.cartEmpty.hidden = state.cart.length > 0;
  selectors.subtotal.textContent = formatAud(cartTotal());

  state.cart.forEach((item) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p>Qty ${item.quantity}</p>
      </div>
      <span class="cart-line-price">${formatAud(item.price * item.quantity)}</span>
    `;
    selectors.cartItems.appendChild(row);
  });

  const totalQuantity = cartQuantity();
  if (selectors.cartCount) {
    selectors.cartCount.hidden = totalQuantity === 0;
    selectors.cartCount.textContent = String(totalQuantity);
  }
}

function openCart() {
  if (!selectors.cartDrawer) {
    return;
  }

  selectors.cartDrawer.classList.add("is-open");
  selectors.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeCart() {
  if (!selectors.cartDrawer) {
    return;
  }

  selectors.cartDrawer.classList.remove("is-open");
  selectors.cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function addSelectedToCart() {
  const bundle = selectedBundle();
  const existing = state.cart.find((item) => item.key === bundle.key);

  if (existing) {
    existing.quantity += state.quantity;
  } else {
    state.cart.push({
      key: bundle.key,
      title: bundle.title,
      description: bundle.description,
      price: bundle.price,
      quantity: state.quantity,
    });
  }

  updateCartUI();
  openCart();
  showToast(`${bundle.title} added to cart`);
}

selectors.bundleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedBundle = button.dataset.bundle;
    updateBundleUI();
  });
});

if (selectors.qtyMinus) {
  selectors.qtyMinus.addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    updateBundleUI();
  });
}

if (selectors.qtyPlus) {
  selectors.qtyPlus.addEventListener("click", () => {
    state.quantity = Math.min(9, state.quantity + 1);
    updateBundleUI();
  });
}

if (selectors.addToCart) {
  selectors.addToCart.addEventListener("click", addSelectedToCart);
}

if (selectors.stickyAdd) {
  selectors.stickyAdd.addEventListener("click", () => {
    state.selectedBundle = "family";
    updateBundleUI();
    addSelectedToCart();
  });
}

selectors.cartTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openCart);
});

if (selectors.closeCart) {
  selectors.closeCart.addEventListener("click", closeCart);
}

if (selectors.cartDrawer) {
  selectors.cartDrawer.addEventListener("click", (event) => {
    if (event.target === selectors.cartDrawer) {
      closeCart();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

if (selectors.languageSelect) {
  selectors.languageSelect.addEventListener("change", () => {
    document.documentElement.lang = selectors.languageSelect.value;
    showToast("Connect Shopify Markets or a translation app before using this market live.");
  });
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}

updateBundleUI();
updateCartUI();
initRevealAnimations();
