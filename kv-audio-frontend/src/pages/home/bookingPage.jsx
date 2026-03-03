import { useEffect, useState } from "react";
import { clearCart, formatDate, loadCart } from "../../utils/cart";
import BookingItem from "../../components/bookingItem";
import axios from "axios";
import toast from "react-hot-toast";

export default function BookingPage() {

    const [cart, setCart] = useState(loadCart());
    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(tomorrow);
    const [total, setTotal] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState("");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // Fetch user orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Recalculate total whenever startDate or endDate changes
    useEffect(() => {
        calculateTotal();
    }, [startDate, endDate]);

    // Fetch user's orders
    function fetchOrders() {
        const token = localStorage.getItem("token");
        if (!token) return;

        setOrdersLoading(true);
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/get`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setOrders(res.data);
                setOrdersLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setOrdersLoading(false);
            });
    }

    // Reload cart items
    function reloadCart() {
        const cartInfo = loadCart();
        setCart(cartInfo);
        calculateTotal();
    }

    // Calculate total quote based on cart and dates
    function calculateTotal() {
        const cartInfo = loadCart();
        setCart(cartInfo);
        cartInfo.startingDate = startDate;
        cartInfo.endingDate = endDate;
        cartInfo.days = totalDays;
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/quote`,
            cartInfo
        ).then((res) => {
            setTotal(res.data.total);
        }).catch((error) => {
            console.error("Error fetching quote:", error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Unable to calculate quote. Please check your cart items.");
            }
            setTotal(0);
        });
    }

    // Handle booking creation
    function handleBookingCreation() {
        const cart = loadCart();
        cart.startingDate = startDate;
        cart.endingDate = endDate;
        cart.days = totalDays;

        const token = localStorage.getItem("token");

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`,
            cart,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((res) => {
            console.log("Booking created successfully:", res.data);
            toast.success("Booking created successfully!");
            setCreatedOrderId(res.data.order.orderId);
            setShowSuccessModal(true);
            clearCart();
            reloadCart();
            fetchOrders();
        }).catch((error) => {
            console.error("Error creating booking:", error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error.response?.status === 401) {
                toast.error("Please login to create a booking");
            } else {
                toast.error("Error creating booking. Please try again.");
            }
        });
    }

    // Delete an order
    // Delete an order - Open Modal
    function handleDeleteOrder(orderId) {
        setOrderToDelete(orderId);
        setShowDeleteModal(true);
    }

    // Confirm Delete
    function confirmDeleteOrder() {
        if (!orderToDelete) return;

        const token = localStorage.getItem("token");
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderToDelete}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success("Order deleted successfully!");
                fetchOrders();
                setShowDeleteModal(false);
                setOrderToDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting order:", error);
                if (error.response?.data?.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Failed to delete order. Please try again.");
                }
            });
    }

    // Calculate the number of days between start and end date
    function calculateDays() {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? diffDays : 0;
    }

    const totalDays = calculateDays();

    // Get status badge styling
    function getStatusBadge(status) {
        const styles = {
            pending: "bg-yellow-500/90 text-white border-yellow-400/50 shadow-lg shadow-yellow-500/30",
            approved: "bg-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30",
            rejected: "bg-red-500/90 text-white border-red-400/50 shadow-lg shadow-red-500/30"
        };
        return styles[status] || styles.pending;
    }

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-primary via-primary to-secondary/20 text-text pt-20 sm:pt-24 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <section className="mb-6 sm:mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm shadow-sm shadow-accent/10">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                        </svg>
                        Your Booking
                    </div>
                    <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text">
                        Create Your Booking
                    </h1>
                    <p className="mt-3 text-sm sm:text-base md:text-lg text-text/60 max-w-3xl leading-relaxed">
                        Review your selected items, choose your rental period, and confirm your booking.
                    </p>
                </section>

                {/* Date Selection Section */}
                <div className="w-full max-w-5xl mx-auto mb-8 sm:mb-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 border border-secondary/30">
                        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-text">Rental Period</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
                            {/* Start Date */}
                            <div className="flex flex-col">
                                <label htmlFor="startDate" className="text-sm font-bold text-text/80 mb-2 uppercase tracking-wide">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={today}
                                    className="min-h-[48px] px-4 sm:px-5 py-3 sm:py-4 border-2 border-secondary/40 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent transition duration-300 text-text bg-white/50 hover:bg-white cursor-pointer font-semibold shadow-sm hover:shadow-md text-base"
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col">
                                <label htmlFor="endDate" className="text-sm font-bold text-text/80 mb-2 uppercase tracking-wide">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || today}
                                    className="min-h-[48px] px-4 sm:px-5 py-3 sm:py-4 border-2 border-secondary/40 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-accent focus:border-accent transition duration-300 text-text bg-white/50 hover:bg-white cursor-pointer font-semibold shadow-sm hover:shadow-md text-base"
                                />
                            </div>
                        </div>

                        {/* Days Display */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent rounded-xl sm:rounded-2xl border border-accent/20 backdrop-blur-sm">
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                                <span className="text-sm sm:text-base text-text/80 font-bold">Total Rental Duration:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl sm:text-4xl font-black text-accent">{totalDays}</span>
                                    <span className="text-sm sm:text-base text-text/70 font-bold">{totalDays === 1 ? 'day' : 'days'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Items Section */}
                <div className="w-full max-w-5xl mx-auto mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-text">Your Items</h2>
                    </div>

                    {cart.orderedItems.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-secondary/30 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-secondary/60 to-secondary/30 flex items-center justify-center">
                                <svg className="w-10 h-10 text-text/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-text mb-2">Your cart is empty</h3>
                            <p className="text-text/60">Add items from the products page to create a booking.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            {cart.orderedItems.map((item) => {
                                return (
                                    <BookingItem key={item.key} itemKey={item.key} qty={item.qty} refresh={reloadCart} />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Total and Booking Button */}
                {cart.orderedItems.length > 0 && (
                    <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16">
                        <div className="bg-gradient-to-r from-accent to-accent/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-accent/40 p-5 sm:p-6 md:p-8 border border-accent/30">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
                                <div>
                                    <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Total Quote</p>
                                    <p className="text-4xl sm:text-5xl font-black text-white">
                                        Rs. {total.toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={handleBookingCreation}
                                    className="w-full sm:w-auto min-h-[52px] px-8 py-4 bg-white text-accent rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order History Section */}
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-text">My Orders</h2>
                    </div>

                    {ordersLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-12 h-12 border-4 border-secondary/30 border-t-accent rounded-full animate-spin" />
                            <p className="text-text/60 font-semibold">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-secondary/30 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-secondary/60 to-secondary/30 flex items-center justify-center">
                                <svg className="w-10 h-10 text-text/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-text mb-2">No orders yet</h3>
                            <p className="text-text/60">Your order history will appear here once you create your first booking.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/30 p-5 group"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderDetails(true);
                                                    }}
                                                    className="text-xl font-black text-accent hover:text-accent/80 transition-colors"
                                                >
                                                    {order.orderId}
                                                </button>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${getStatusBadge(order.status)} capitalize`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    {order.orderedItems.length} {order.orderedItems.length === 1 ? 'item' : 'items'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-text/50 font-semibold uppercase">Total</p>
                                                <p className="text-2xl font-black text-accent">Rs. {order.totalAmount?.toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteOrder(order.orderId)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group/delete hover:scale-110 active:scale-95"
                                                title="Delete order"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scaleIn">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-text mb-3">Booking Created!</h2>
                            <p className="text-text/60 mb-6">Your booking has been successfully created.</p>

                            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-5 mb-6 border border-accent/20">
                                <p className="text-sm text-text/70 font-semibold mb-2">Your Order ID</p>
                                <p className="text-3xl font-black text-accent">{createdOrderId}</p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    setCreatedOrderId("");
                                }}
                                className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent/90 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 my-8 transform animate-scaleIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-black text-text">Order Details</h2>
                            <button
                                onClick={() => {
                                    setShowOrderDetails(false);
                                    setSelectedOrder(null);
                                }}
                                className="p-2 hover:bg-secondary/30 rounded-xl transition-colors"
                            >
                                <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-4 border border-accent/20">
                                    <p className="text-xs text-text/60 font-semibold uppercase mb-1">Order ID</p>
                                    <p className="text-xl font-black text-accent">{selectedOrder.orderId}</p>
                                </div>
                                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-4 border border-secondary/30">
                                    <p className="text-xs text-text/60 font-semibold uppercase mb-1">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getStatusBadge(selectedOrder.status)} capitalize`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Rental Period */}
                            <div className="bg-secondary/10 rounded-2xl p-5 border border-secondary/30">
                                <p className="text-sm font-bold text-text/80 mb-3 uppercase tracking-wide">Rental Period</p>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-text/60 mb-1">Start Date</p>
                                        <p className="font-bold text-text">{new Date(selectedOrder.startingDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text/60 mb-1">End Date</p>
                                        <p className="font-bold text-text">{new Date(selectedOrder.endingDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text/60 mb-1">Duration</p>
                                        <p className="font-bold text-accent">{selectedOrder.days} {selectedOrder.days === 1 ? 'day' : 'days'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered Items */}
                            <div>
                                <p className="text-sm font-bold text-text/80 mb-3 uppercase tracking-wide">Ordered Items</p>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {selectedOrder.orderedItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-text">{item.product.name}</p>
                                                <p className="text-sm text-text/60">Qty: {item.product.quantity}</p>
                                            </div>
                                            <p className="font-black text-accent">Rs. {(item.product.price * item.product.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-accent to-accent/90 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold">Total Amount</p>
                                    <p className="text-4xl font-black">Rs. {selectedOrder.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scaleIn">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-text mb-3">Delete Order?</h2>
                            <p className="text-text/60 mb-8">Are you sure you want to delete this order? This action cannot be undone.</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setOrderToDelete(null);
                                    }}
                                    className="flex-1 px-6 py-4 bg-secondary/10 text-text/80 rounded-2xl font-bold hover:bg-secondary/20 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteOrder}
                                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </main>
    )
}
