// Helper function to get the cart key based on user login status
function getCartKey() {
    const email = localStorage.getItem("email");
    return email ? `cart_${email}` : "cart";
}

// Function to load the cart from localStorage or initialize a new one
export function loadCart() {

    const cartKey = getCartKey();
    let cart = localStorage.getItem(cartKey);

    if (cart === null) {
        cart = {
            orderedItems: [],
            days: 1,
            startingDate: formatDate(new Date()),
            endingDate: formatDate(new Date())
        }

        const cartString = JSON.stringify(cart); // Convert JSON object to string
        localStorage.setItem(cartKey, cartString); // Store string in localStorage
        return cart; // Return the cart object
    }

    cart = JSON.parse(cart); // Parse the string back to JSON object
    return cart; // Return the existing cart object
}


// Function to add an item to the cart
export function addToCart(key, qty) {

    const cart = loadCart(); // Load existing cart
    const cartKey = getCartKey();

    let itemFound = false;

    for (let i = 0; i < cart.orderedItems.length; i++) {
        if (cart.orderedItems[i].key === key) {
            // Item already in cart, update quantity
            cart.orderedItems[i].qty += qty;
            itemFound = true; // Mark that we found the item
            break;
        }
    }

    if (!itemFound) {
        cart.orderedItems.push({ key, qty }); // Add new item to cart
    }

    const cartString = JSON.stringify(cart); // Convert updated cart to string
    localStorage.setItem(cartKey, cartString); // Store updated cart in localStorage
}


// Function to remove an item from the cart by its key
export function removeFromCart(key) {
    const cart = loadCart(); // Load existing cart
    const cartKey = getCartKey();

    cart.orderedItems = cart.orderedItems.filter(item => item.key !== key); // Remove item with matching key
    const cartString = JSON.stringify(cart); // Convert updated cart to string
    localStorage.setItem(cartKey, cartString); // Store updated cart in localStorage
}



// Function to format a Date object as 'YYYY-MM-DD'
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
}


// Function to clear the entire cart
export function clearCart() {
    const cartKey = getCartKey();
    const emptyCart = {
        orderedItems: [],
        days: 1,
        startingDate: formatDate(new Date()),
        endingDate: formatDate(new Date())
    };
    localStorage.setItem(cartKey, JSON.stringify(emptyCart));
}

