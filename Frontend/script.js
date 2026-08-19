const productUrl = "http://localhost:5261/api/product";
const orderUrl = "http://localhost:5127/api/order";

let products = [];
let cart = [];


// Get products from ProductService
async function loadProducts() {
    try {
        const response = await fetch(productUrl);

        if (!response.ok) {
            throw new Error("Could not load products");
        }

        products = await response.json();

        displayProducts();
    }
    catch (error) {
        console.error(error);
        document.getElementById("products").innerHTML =
            "<p>Unable to load products.</p>";
    }
}


// Display products
function displayProducts() {

    const productsDiv = document.getElementById("products");

    productsDiv.innerHTML = "";

    products.forEach(product => {

        productsDiv.innerHTML += `
            <div class="product">
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>

                <input
                    type="number"
                    id="quantity-${product.id}"
                    class="quantity"
                    value="1"
                    min="1">

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}


// Add product to cart
function addToCart(productId) {

    const quantity =
        parseInt(document.getElementById(`quantity-${productId}`).value);

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.push({
            productId: productId,
            quantity: quantity
        });
    }

    displayCart();
}


// Display cart
function displayCart() {

    const cartDiv = document.getElementById("cart");

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.productId);

        const itemTotal = product.price * item.quantity;

        total += itemTotal;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <h3>${product.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₹${itemTotal}</p>
            </div>
        `;
    });

    document.getElementById("cartTotal").innerText =
        `Total: ₹${total}`;
}


// Place order
async function placeOrder() {

    if (cart.length === 0) {
        document.getElementById("message").innerText =
            "Cart is empty.";
        return;
    }

    try {

        for (const item of cart) {

            const response = await fetch(orderUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productId: item.productId,
                    quantity: item.quantity
                })
            });

            if (!response.ok) {
                throw new Error("Failed to place order");
            }
        }

        document.getElementById("message").innerText =
            "Order placed successfully!";

        cart = [];

        displayCart();

    }
    catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            "Failed to place order.";
    }
}
async function loadOrders() {
    const ordersDiv = document.getElementById("orders");

    try {
        const response = await fetch("http://localhost:5127/api/order");

        if (!response.ok) {
            throw new Error("Failed to get orders");
        }

        const orders = await response.json();

        ordersDiv.innerHTML = "";

        if (orders.length === 0) {
            ordersDiv.innerHTML = "<p>No orders found.</p>";
            return;
        }

        orders.forEach(order => {
            ordersDiv.innerHTML += `
                <div class="order-card">
                    <p><strong>Product:</strong> ${order.productName}</p>
                    <p><strong>Quantity:</strong> ${order.quantity}</p>
                    <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
                </div>
            `;
        });

    } catch (error) {
        ordersDiv.innerHTML = "<p>Unable to load orders.</p>";
        console.error(error);
    }
}

// Load products when page opens
loadProducts();