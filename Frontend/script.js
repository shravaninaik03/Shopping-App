const PRODUCT_API = "http://localhost:5261/api/product";
const ORDER_API = "http://localhost:5127/api/order";

let products = [];
let cart = [];


// ==============================
// LOAD PRODUCTS
// ==============================

async function loadProducts() {

    const productsDiv = document.getElementById("products");
    const loading = document.getElementById("loadingProducts");

    try {

        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        loading.style.display = "none";

        displayProducts(products);

        document.getElementById("productCount").textContent =
            `${products.length} products`;

    } catch (error) {

        loading.textContent = "Unable to load products.";

        console.error(error);
    }
}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts(productList) {

    const productsDiv = document.getElementById("products");

    productsDiv.innerHTML = "";

    if (productList.length === 0) {

        productsDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }

    productList.forEach(product => {

        const stockAvailable = product.stock > 0;

        productsDiv.innerHTML += `
            <div class="product-card">

                <div class="product-image">
                    ${getProductIcon(product.name)}
                </div>

                <h3>${product.name}</h3>

                <div class="product-price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </div>

                <div class="${stockAvailable ? "stock" : "stock out-stock"}">
                    ${stockAvailable
                        ? `✓ ${product.stock} in stock`
                        : "✕ Out of stock"}
                </div>

                <div class="product-controls">

                    <input
                        type="number"
                        id="quantity-${product.id}"
                        class="quantity-input"
                        value="1"
                        min="1"
                        max="${product.stock}"
                        ${!stockAvailable ? "disabled" : ""}
                    >

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})"
                        ${!stockAvailable ? "disabled" : ""}
                    >
                        Add to Cart
                    </button>

                </div>

            </div>
        `;
    });
}


// ==============================
// PRODUCT ICON
// ==============================

function getProductIcon(name) {

    const lower = name.toLowerCase();

    if (lower.includes("laptop")) return "💻";
    if (lower.includes("mouse")) return "🖱️";
    if (lower.includes("keyboard")) return "⌨️";
    if (lower.includes("headphone")) return "🎧";
    if (lower.includes("monitor")) return "🖥️";
    if (lower.includes("phone")) return "📱";
    if (lower.includes("tablet")) return "📱";
    if (lower.includes("camera")) return "📷";
    if (lower.includes("speaker")) return "🔊";
    if (lower.includes("drive")) return "💾";
    if (lower.includes("controller")) return "🎮";
    if (lower.includes("stand")) return "🖥️";

    return "📦";
}


// ==============================
// ADD TO CART
// ==============================

function addToCart(productId) {

    const product = products.find(p => p.id === productId);

    if (!product) {
        return;
    }

    const quantityInput =
        document.getElementById(`quantity-${productId}`);

    const quantity = parseInt(quantityInput.value);

    if (!quantity || quantity < 1) {

        showToast("Please enter a valid quantity.");

        return;
    }

    if (quantity > product.stock) {

        showToast("Not enough stock available.");

        return;
    }

    const existingItem =
        cart.find(item => item.productId === productId);

    if (existingItem) {

        if (existingItem.quantity + quantity > product.stock) {

            showToast("Not enough stock available.");

            return;
        }

        existingItem.quantity += quantity;

    } else {

        cart.push({
            productId: productId,
            quantity: quantity
        });
    }

    displayCart();

    showToast(`${product.name} added to cart ✓`);
}


// ==============================
// DISPLAY CART
// ==============================

function displayCart() {

    const cartDiv = document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartItemsText =
        document.getElementById("cartItemsText");

    let total = 0;
    let itemCount = 0;

    cartDiv.innerHTML = "";

    if (cart.length === 0) {

        cartDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>
            </div>
        `;

        cartCount.textContent = "0";
        cartItemsText.textContent = "0 items";

        updateTotal(0);

        return;
    }

    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.productId);

        if (!product) {
            return;
        }

        const itemTotal =
            Number(product.price) * item.quantity;

        total += itemTotal;
        itemCount += item.quantity;

        cartDiv.innerHTML += `
            <div class="cart-item">

                <div class="cart-product">

                    <div class="cart-product-icon">
                        ${getProductIcon(product.name)}
                    </div>

                    <div>
                        <h4>${product.name}</h4>
                        <small>
                            ₹${Number(product.price).toLocaleString("en-IN")}
                            each
                        </small>
                    </div>

                </div>

                <div class="cart-right">

                    <div class="cart-quantity">

                        <button
                            class="quantity-btn"
                            onclick="changeQuantity(
                                ${product.id},
                                -1
                            )"
                        >
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button
                            class="quantity-btn"
                            onclick="changeQuantity(
                                ${product.id},
                                1
                            )"
                        >
                            +
                        </button>

                    </div>

                    <strong>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${product.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    cartCount.textContent = itemCount;
    cartItemsText.textContent =
        `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

    updateTotal(total);
}


// ==============================
// CHANGE QUANTITY
// ==============================

function changeQuantity(productId, change) {

    const item =
        cart.find(item => item.productId === productId);

    const product =
        products.find(product => product.id === productId);

    if (!item || !product) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }

    if (item.quantity > product.stock) {

        item.quantity = product.stock;

        showToast("Maximum available stock reached.");
    }

    displayCart();
}


// ==============================
// REMOVE FROM CART
// ==============================

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.productId !== productId);

    displayCart();

    showToast("Item removed from cart.");
}


// ==============================
// UPDATE TOTAL
// ==============================

function updateTotal(total) {

    const formatted =
        `₹${Number(total).toLocaleString("en-IN")}`;

    document.getElementById("cartTotal").textContent =
        formatted;

    document.getElementById("finalTotal").textContent =
        formatted;
}


// ==============================
// PLACE ORDER
// ==============================

async function placeOrder() {

    const message =
        document.getElementById("orderMessage");

    const button =
        document.getElementById("placeOrderButton");

    if (cart.length === 0) {

        showToast("Your cart is empty.");

        return;
    }

    button.disabled = true;
    button.textContent = "Placing Order...";

    message.textContent = "";

    try {

        for (const item of cart) {

            const response = await fetch(
                ORDER_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        productId: item.productId,
                        quantity: item.quantity
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Order failed");
            }
        }

        cart = [];

        displayCart();

        showToast("Order placed successfully ✓");

        message.textContent =
            "✓ Order placed successfully!";

        message.style.color = "#16a34a";

        loadOrders();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Failed to place order.";

        message.style.color = "#dc2626";

        showToast("Failed to place order.");

    } finally {

        button.disabled = false;
        button.textContent = "Place Order →";
    }
}


// ==============================
// GET ORDERS
// ==============================

async function loadOrders() {

    const ordersDiv =
        document.getElementById("orders");

    ordersDiv.innerHTML = `
        <div class="orders-placeholder">
            <div>⏳</div>
            <p>Loading orders...</p>
        </div>
    `;

    try {

        const response =
            await fetch(ORDER_API);

        if (!response.ok) {
            throw new Error("Failed to get orders");
        }

        const orders =
            await response.json();

        ordersDiv.innerHTML = "";

        if (orders.length === 0) {

            ordersDiv.innerHTML = `
                <div class="orders-placeholder">
                    <div>📦</div>
                    <h3>No orders yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>
            `;

            return;
        }

        orders.forEach((order, index) => {

            ordersDiv.innerHTML += `
                <div class="order-card">

                    <div class="order-top">

                        <span class="order-number">
                            Order #${order.id}
                        </span>

                        <span class="order-status">
                            PLACED
                        </span>

                    </div>

                    <div class="order-info">

                        <div>
                            <h3>
                                ${order.productName}
                            </h3>

                            <p>
                                Quantity: ${order.quantity}
                            </p>
                        </div>

                        <div class="order-price">
                            ₹${Number(order.totalPrice)
                                .toLocaleString("en-IN")}
                        </div>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);

        ordersDiv.innerHTML = `
            <div class="orders-placeholder">
                <div>⚠️</div>
                <h3>Unable to load orders</h3>
                <p>Please try again.</p>
            </div>
        `;
    }
}


// ==============================
// SEARCH
// ==============================

function searchProducts() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const filtered =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(search)
        );

    displayProducts(filtered);

    document.getElementById("productCount").textContent =
        `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;
}


// ==============================
// SCROLL FUNCTIONS
// ==============================

function scrollToProducts() {

    document
        .getElementById("productsSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}

function scrollToCart() {

    document
        .getElementById("cartSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}

function scrollToOrders() {

    document
        .getElementById("ordersSection")
        .scrollIntoView({
            behavior: "smooth"
        });

    loadOrders();
}


// ==============================
// TOAST
// ==============================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ==============================
// INITIAL LOAD
// ==============================

loadProducts();