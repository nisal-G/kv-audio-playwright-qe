import axios from "axios";
import { useEffect, useState } from "react";
import { removeFromCart } from "../utils/cart";

export default function BookingItem(props) {

    // Extract props: itemKey (product ID), qty (quantity), refresh (callback to update parent)
    const { itemKey, qty, refresh } = props;

    // State to store product details fetched from API
    const [item, setItem] = useState(null);

    // Track loading status: "loading" | "loaded" | "error"
    const [status, setStatus] = useState("loading");

    // Fetch product details when component mounts or status changes
    useEffect(() => {

        if (status === "loading") {
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/products/get/${itemKey}`

            // Request product data from backend
            axios.get(apiUrl)
                .then((res) => {
                    setItem(res.data)
                    setStatus("loaded")
                    console.log(res.data)
                }).catch((error) => {
                    // If product not found or error occurs, remove from cart
                    console.error("Error fetching product data:", error)
                    setStatus("error")
                    removeFromCart(itemKey);
                    refresh(); // Refresh the cart in the parent component
                })
        }


    }, [status]);

    // Remove item from cart and update parent component
    const handleRemoveItem = () => {
        removeFromCart(itemKey);
        refresh();
    };

    // Update item quantity in localStorage and trigger parent refresh
    const updateQuantity = (newQty) => {
        if (newQty < 1) return; // Don't allow quantity less than 1

        // Get the user-scoped cart key
        const email = localStorage.getItem("email");
        const cartKey = email ? `cart_${email}` : "cart";

        const cart = JSON.parse(localStorage.getItem(cartKey));
        const itemIndex = cart.orderedItems.findIndex(item => item.key === itemKey);

        if (itemIndex !== -1) {
            cart.orderedItems[itemIndex].qty = newQty;
            localStorage.setItem(cartKey, JSON.stringify(cart));
            refresh();
        }
    };

    // Increase quantity by 1
    const handleIncreaseQty = () => {
        updateQuantity(qty + 1);
    };

    // Decrease quantity by 1 (minimum is 1)
    const handleDecreaseQty = () => {
        if (qty > 1) {
            updateQuantity(qty - 1);
        }
    };

    // Show skeleton loader while fetching product data
    if (status === "loading") {
        return (
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Hide component if product failed to load or doesn't exist
    if (status === "error" || !item) {
        return null;
    }

    // Calculate total price for this item (unit price × quantity)
    const totalPrice = item.price * qty;

    // Render the booking item card with image, details, quantity controls, and remove button
    return (
        <div className="w-full max-w-5xl bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-secondary/30 overflow-hidden mb-4">
            <div className="flex flex-col sm:flex-row items-stretch">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-40 sm:h-32 bg-gradient-to-br from-secondary/20 to-accent/10 flex-shrink-0 relative overflow-hidden">
                    {item.image && item.image.length > 0 ? (
                        <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {/* Availability Badge */}
                    <div className="absolute top-2 left-2">
                        {item.availability ? (
                            <span className="px-2.5 py-1 bg-emerald-500/95 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Available
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 bg-red-500/95 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                                Unavailable
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 p-4 sm:p-5">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            {/* Product Name and Category */}
                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                                <div className="flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-text mb-1.5 sm:mb-2 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent capitalize border border-accent/20">
                                            {item.category}
                                        </span>
                                        {item.dimensions && (
                                            <span className="inline-flex items-center gap-1 text-xs text-text/60 font-medium">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                </svg>
                                                {item.dimensions}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {item.description && (
                                <p className="text-sm text-text/70 line-clamp-2 mb-3 leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        {/* Price and Quantity Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-secondary/20">
                            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 w-full sm:w-auto">
                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-text/70">Qty:</span>
                                    <div className="flex items-center gap-0.5 bg-secondary/10 rounded-lg overflow-hidden border border-secondary/30">
                                        <button
                                            onClick={handleDecreaseQty}
                                            disabled={qty <= 1}
                                            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center hover:bg-secondary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                                            title="Decrease quantity"
                                        >
                                            <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="text-sm font-bold text-text min-w-[2.5rem] text-center">{qty}</span>
                                        <button
                                            onClick={handleIncreaseQty}
                                            className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center hover:bg-secondary/30 transition-colors active:scale-95"
                                            title="Increase quantity"
                                        >
                                            <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Unit Price */}
                                <div className="flex flex-col">
                                    <span className="text-xs text-text/50 font-semibold">Unit Price</span>
                                    <span className="text-sm font-bold text-text">
                                        Rs. {item.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Total Price and Remove */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className="text-left sm:text-right">
                                    <span className="text-xs text-text/50 font-semibold block">Total</span>
                                    <span className="text-xl sm:text-2xl font-black text-accent">
                                        Rs. {totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={handleRemoveItem}
                                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group hover:scale-110 active:scale-95"
                                    title="Remove from cart"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
