const products = [
  { id: "tradicional", name: "Tradicional", category: "classicos", price: 10, unit: "unidade", emoji: "🍪", description: "Gotas de chocolate e pedaços de meio amargo.",  style: "--cookie-color:#d39156;--chip:#4b291e;--chip2:#603423;--filling:#4b291e;" },
  { id: "nutella", name: "Nutella", category: "recheados", price: 14, unit: "unidade", emoji: "🍫", description: "Massa macia e um centro generoso de Nutella.", featured: true, style: "--cookie-color:#ca7b43;--chip:#4c281d;--chip2:#311813;--filling:#382019;--cookie-rotation:7deg;" },
  { id: "branco", name: "Chocolate Branco", category: "recheados", price: 12, unit: "unidade", emoji: "🤍", description: "Gotas brancas e recheio cremoso de chocolate branco.", style: "--cookie-color:#dda16a;--chip:#fff5db;--chip2:#f7e8bd;--filling:#fff0c9;" },
  { id: "smore", name: "S’more", category: "recheados", price: 14, unit: "unidade", emoji: "🔥", description: "Chocolate meio amargo e marshmallow derretendo.", style: "--cookie-color:#c87943;--chip:#593022;--chip2:#fff2d2;--filling:#f4e7c7;--cookie-rotation:5deg;" },
  { id: "pistache", name: "Pistache", category: "recheados", price: 17, unit: "unidade", emoji: "💚", description: "Chocolate branco, creme de pistache e castanha de caju.", style: "--cookie-color:#d49a66;--chip:#f7edce;--chip2:#789860;--filling:#799b5f;--cookie-rotation:-4deg;" },
  { id: "kinder", name: "Kinder Bueno", category: "recheados", price: 17, unit: "unidade", emoji: "🤎", description: "Chocolate branco e preto com recheio Kinder.", featured: true, style: "--cookie-color:#d69a63;--chip:#f9efd3;--chip2:#4d2a20;--filling:#e8d4ac;--cookie-rotation:8deg;" },
  { id: "red_velvet", name: "Red Velvet", category: "recheados", price: 17, unit: "unidade", emoji: "❤️", description: "Chocolate branco e vermelho com recheio cremoso.", style: "--cookie-color:#d46a6a;--chip:#fff5db;--chip2:#f7e8bd;--filling:#fff0c9;" },
  { id: "bites", name: "Cookie Bites", category: "compartilhar", price: 10, unit: "pacote com 15", emoji: "✨", description: "Mini cookies crocantes para dividir — ou não.", style: "--cookie-color:#cf8950;--chip:#4b291e;--chip2:#5e3425;--filling:#4b291e;" },
  { id: "coffe_melt", name: "Coffee Melt", category: "recheados", price: 15, unit: "unidade", emoji: "☕", description: "Chocolate ao leite e café com recheio cremoso, juntamente com uma espuma de cream cheese em cima.", style: "--cookie-color:#c87943;--chip:#593022;--chip2:#fff2d2;--filling:#f4e7c7;--cookie-rotation:5deg;" }
];
  
const productPhotos = {
  tradicional: "assets/Tradicional_site.png",
  nutella: "assets/nutella_site.png",
  branco: "assets/Chocolate.Branco_site.png",
  smore: "assets/S'more_site.png",
  bites: "assets/Bites_site.png",
  kinder: "assets/Kinder_site.png",
  pistache: "assets/Pistache_site.png",
  red_velvet: "assets/Red.Velvet_site.png",
  coffe_melt: "assets/coffe_melt.png"
};

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
let cart = JSON.parse(localStorage.getItem("bs-cart") || "{}");
let activeFilter = "todos";
let currentStep = 1;

const menuGrid = document.querySelector("#menuGrid");
const cartDrawer = document.querySelector("#cartDrawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const emptyCart = document.querySelector("#emptyCart");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const nextStep = document.querySelector("#nextStep");
const prevStep = document.querySelector("#prevStep");
const whatsappOrder = document.querySelector("#whatsappOrder");
const customerForm = document.querySelector("#customerForm");

function cartQuantity() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartValue() {
  return products.reduce((sum, product) => sum + (cart[product.id] || 0) * product.price, 0);
}

function orderTotals() {
  const subtotal = cartValue();

  const isDelivery =
    customerForm.elements.fulfillment.value === "Entrega";

  const deliveryFee =
    isDelivery && cartQuantity() > 0 ? 4 : 0;

  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee
  };
}

function renderMenu() {
  const visible = products.filter(product => activeFilter === "todos" || product.category === activeFilter);
  menuGrid.innerHTML = visible.map(product => {
    const qty = cart[product.id] || 0;
    return `
      <article class="menu-card ${product.featured ? "featured" : ""}">
        ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
        ${productPhotos[product.id]
          ? `<div class="product-art photo-${product.id}"><img src="${productPhotos[product.id]}" alt="Cookie ${product.name} original da B&S Cookies" loading="lazy" width="480" height="480"></div>`
          : `<div class="product-art brand-product"><img src="assets/logo-original.png" alt="" loading="lazy" width="160" height="160"><span>B&amp;S Cookies</span></div>`}
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${money.format(product.price)}<small>${product.unit}</small></span>
          ${qty ? qtyControl(product.id, qty, `Quantidade de ${product.name}`) : `<button class="add-button" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao pedido">+</button>`}
        </div>
      </article>`;
  }).join("");
}

function qtyControl(id, qty, label) {
  return `<div class="qty" aria-label="${label}">
    <button type="button" data-change="${id}" data-delta="-1" aria-label="Remover uma unidade">−</button>
    <span>${qty}</span>
    <button type="button" data-change="${id}" data-delta="1" aria-label="Adicionar uma unidade">+</button>
  </div>`;
}

function updateCart(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (!cart[id]) delete cart[id];
  localStorage.setItem("bs-cart", JSON.stringify(cart));
  renderMenu();
  renderCart();
  if (delta > 0) showToast("Adicionado ao seu pedido");
}

function renderCart() {
  const selected = products.filter(product => cart[product.id]);
  const quantity = cartQuantity();
  const { total, deliveryFee } = orderTotals();
  cartCount.textContent = quantity;
  cartTotal.textContent = money.format(total);

  document.querySelector("#deliveryAmount").textContent =
    money.format(deliveryFee);

  document.querySelector("#deliverySummary").hidden =
    deliveryFee === 0;
    
  document.querySelector("#menuCartSummary").textContent = quantity ? `${quantity} ${quantity === 1 ? "item" : "itens"} · ${money.format(total)}` : "Escolha seu primeiro cookie";
  emptyCart.hidden = selected.length > 0;
  cartItems.innerHTML = selected.map(product => `
    <div class="cart-item">
      <div class="cart-thumb" aria-hidden="true"><img src="${productPhotos[product.id] || "assets/logo-original.png"}" alt="" width="52" height="52"></div>
      <div><h4>${product.name}</h4><p>${money.format(product.price)} · ${product.unit}</p></div>
      ${qtyControl(product.id, cart[product.id], `Quantidade de ${product.name}`)}
      <strong>${money.format(product.price * cart[product.id])}</strong>
    </div>`).join("");
  nextStep.disabled = quantity === 0;
}

function openCart() {
  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add("show");
    cartDrawer.classList.add("open");
  });
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setStep(1);
  document.querySelector("#closeCart").focus();
}

function closeCart() {
  overlay.classList.remove("show");
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  setTimeout(() => { overlay.hidden = true; }, 300);
  document.querySelector("#openCart").focus();
}

function setStep(step) {
  currentStep = step;
  document.querySelectorAll(".checkout-step").forEach(section => section.classList.toggle("active", Number(section.dataset.step) === step));
  document.querySelector("#stepLabel").textContent = `Etapa ${step} de 3`;
  document.querySelector("#progressBar").style.width = `${step * 33.333}%`;
  prevStep.hidden = step === 1;
  nextStep.hidden = step === 3;
  whatsappOrder.hidden = step !== 3;
  nextStep.textContent = step === 1 ? "Continuar" : "Revisar pedido";
  nextStep.disabled = step === 1 && cartQuantity() === 0;
  if (step === 3) prepareReview();
  document.querySelector(".drawer-body").scrollTop = 0;
}

function validateCustomer() {
  const name = document.querySelector("#customerName");
  const day = document.querySelector("#preferredTime");
  const payment = document.querySelector("#paymentMethod");
  const address = document.querySelector("#address");

  const fulfillment = customerForm.elements.fulfillment.value;

  const fields = [
    name,
    payment,
    day,
    ...(fulfillment === "Entrega" ? [address] : [])
  ];

  let valid = true;

  fields.forEach(field => {
    const ok = field.value.trim().length > 0;

    field.closest("label").classList.toggle("invalid", !ok);

    if (!ok) valid = false;
  });

  if (!valid) {
    fields.find(field => !field.value.trim())?.focus();
  }

  return valid;
}

function orderDetails() {
  const fulfillment = customerForm.elements.fulfillment.value;

  return {
    name: document.querySelector("#customerName").value.trim(),

    fulfillment: fulfillment,

    address: fulfillment === "Entrega"
      ? document.querySelector("#address").value.trim()
      : "",

    day: document.querySelector("#preferredTime").value.trim(),

    paymentMethod: document.querySelector("#paymentMethod").value,

    notes: document.querySelector("#notes").value.trim()
  };
}

function prepareReview() {
  const info = orderDetails();
  const { subtotal, deliveryFee, total } = orderTotals();
  const selected = products.filter(product => cart[product.id]);
  document.querySelector("#reviewContent").innerHTML = `
    <div class="review-group"><h4>Itens</h4>
      ${selected.map(product => `<div class="review-row"><span>${cart[product.id]}× ${product.name}</span><strong>${money.format(cart[product.id] * product.price)}</strong></div>`).join("")}
      <div class="review-row"><span>Subtotal dos cookies</span><strong>${money.format(subtotal)}</strong></div>
      </div>
    <div class="review-group"><h4>Recebimento</h4>
      <div class="review-row"><span>Nome</span><strong>${escapeHtml(info.name)}</strong></div>
      <div class="review-row"><span>Opção</span><strong>${info.fulfillment}</strong></div>
      ${info.address ? `<div class="review-row"><span>Endereço</span><strong>${escapeHtml(info.address)}</strong></div>` : ""}
      <div class="review-row"><span>Preferência</span><strong>${escapeHtml(info.day)}</strong></div>
<div class="review-row"><span>Pagamento</span><strong>${escapeHtml(info.paymentMethod)}</strong></div>
      ${info.notes ? `<div class="review-row"><span>Observação</span><strong>${escapeHtml(info.notes)}</strong></div>` : ""}
    </div>`;

  const lines = selected.map(product => `• ${cart[product.id]}x ${product.name} — ${money.format(cart[product.id] * product.price)}`);
  const message = [
    "Olá, B&S Cookies!",
    "",
    `Meu nome é ${info.name} e montei este pedido pelo site:`,
    ...lines,
    "",
        `Subtotal dos produtos: ${money.format(subtotal)}`,
    `Taxa de entrega: ${money.format(deliveryFee)}`,
    `*Total do pedido: ${money.format(total)}*`,

    info.fulfillment === "Entrega"
      ? `Forma: Entrega\nEndereço: ${info.address}`
      : "Forma: Retirada",
        `Preferência: ${info.day}`,
    `Pagamento: ${info.paymentMethod}`,
    info.notes ? `Observações: ${info.notes}` : "",
    "",
    
    "Podem confirmar a disponibilidade, por favor?"
  ].filter(Boolean).join("\n");
  whatsappOrder.href = `https://wa.me/5519994060215?text=${encodeURIComponent(message)}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const change = event.target.closest("[data-change]");
  if (add) updateCart(add.dataset.add, 1);
  if (change) updateCart(change.dataset.change, Number(change.dataset.delta));
});

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  renderMenu();
}));

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#openCartBottom").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
document.querySelector("#backToMenu").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart(); });

nextStep.addEventListener("click", () => {
  if (currentStep === 1 && cartQuantity()) setStep(2);
  else if (currentStep === 2 && validateCustomer()) setStep(3);
});
prevStep.addEventListener("click", () => setStep(currentStep - 1));

customerForm.elements.fulfillment.forEach(radio => {
  radio.addEventListener("change", () => {
    const delivery =
      customerForm.elements.fulfillment.value === "Entrega";

    document.querySelector("#addressFields").hidden = !delivery;
    document.querySelector("#address").required = delivery;

    renderCart();
  });
});
customerForm.addEventListener("input", event => event.target.closest("label")?.classList.remove("invalid"));
whatsappOrder.addEventListener("click", () => showToast("WhatsApp aberto — revise antes de enviar"));
document.querySelector("#year").textContent = new Date().getFullYear();
renderMenu();
renderCart();
