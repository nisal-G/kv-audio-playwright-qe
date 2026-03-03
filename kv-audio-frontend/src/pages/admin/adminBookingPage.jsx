import axios from "axios";
import { useEffect, useState } from "react";
import { IoClose, IoSearchOutline, IoFilterOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";

export default function AdminOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (loading) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                console.log("Fetched orders:", response.data);
                setOrders(response.data);
                setLoading(false);

            }).catch(error => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
        }
    }, [loading]);


    // Handle order status update
    function handleOrderStatusChange(orderId, status) {
        const token = localStorage.getItem('token');

        // Ideally we would show a loading state on the button itself, 
        // but for now we rely on the global loading refresh after update.
        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/updateStatus/${orderId}`, {
            status: status
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("Order status updated:", response.data);
            setSelectedOrder(null); // Close modal
            setLoading(true); // Trigger re-fetch of orders
        }).catch(error => {
            console.error("Error updating order status:", error);
            // Optional: show error message to user
        });
    }

    return (
        <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
            {/* Top Bar with decorative background */}
            <div className="w-full h-[300px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

            <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FaBoxOpen className="text-white/80" />
                        Orders Management
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                            {orders.length} orders
                        </span>
                    </h1>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <p className="text-white/80 font-medium">Loading orders...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in-50 duration-500">
                        {orders.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <FaBoxOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
                                <p className="text-gray-500 max-w-sm">It seems there are no orders placed yet. New orders will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="overflow-auto custom-scrollbar flex-1">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 shadow-sm">
                                        <tr>
                                            {['Order ID', 'Email', 'Order Date', 'Start Date', 'End Date', 'Days', 'Items', 'Total', 'Status'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-8">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr
                                                key={order._id}
                                                onClick={() => setSelectedOrder(order)}
                                                className="group hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                                            >
                                                <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold group-hover:text-blue-700 first:pl-8">
                                                    #{order.orderId}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-200">
                                                            {order.email.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="truncate max-w-[150px]" title={order.email}>{order.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.startingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.endingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold border border-gray-200">
                                                        {order.days}d
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden items-center">
                                                        {order.orderedItems.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center overflow-hidden" title={item.product.name}>
                                                                {item.product.image ? (
                                                                    <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-500">?</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {order.orderedItems.length > 3 && (
                                                            <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500 border border-gray-200">
                                                                +{order.orderedItems.length - 3}
                                                            </div>
                                                        )}
                                                        <span className="ml-3 text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                                            {order.orderedItems.length} items
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    Rs. {order.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${order.status === 'Approved'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : order.status === 'Rejected'
                                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full mr-2 ${order.status === 'Approved' ? 'bg-emerald-500' :
                                                                order.status === 'Rejected' ? 'bg-red-500' :
                                                                    'bg-amber-500'
                                                            }`}></span>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FaBoxOpen size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Details</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-500">Order ID:</span>
                                        <span className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{selectedOrder.orderId}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar bg-white/50">
                            {/* Status & Key Info Cards - Modern Grids */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Order Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full shadow-sm ${selectedOrder.status === 'Approved' ? 'bg-emerald-500 shadow-emerald-200' :
                                            selectedOrder.status === 'Rejected' ? 'bg-red-500 shadow-red-200' :
                                                'bg-amber-500 shadow-amber-200'
                                            }`}></div>
                                        <span className={`text-lg font-bold ${selectedOrder.status === 'Approved' ? 'text-emerald-700' :
                                            selectedOrder.status === 'Rejected' ? 'text-red-700' :
                                                'text-amber-700'
                                            }`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Amount</p>
                                    <p className="text-xl font-bold text-gray-900 tracking-tight">Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Details</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                            {selectedOrder.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.email}</p>
                                            <p className="text-xs text-gray-500">Ordered on {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline/Duration Section */}
                            <div className="mb-8 p-1 rounded-3xl bg-gray-50/80 border border-gray-100">
                                <div className="bg-white rounded-[1.3rem] p-6 shadow-sm border border-gray-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Start Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{new Date(selectedOrder.startingDate).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto px-4">
                                        <div className="h-[2px] w-full md:w-24 bg-gray-200 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-500 whitespace-nowrap border border-gray-200">
                                                {selectedOrder.days} Days
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">End Date</p>
                                        <p className="text-lg font-semibold text-gray-800">{new Date(selectedOrder.endingDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered Items List */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    Ordered Items
                                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium align-middle">{selectedOrder.orderedItems.length}</span>
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.orderedItems.map((item, index) => (
                                        <div key={index} className="group flex items-center gap-4 p-3 pr-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200">
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform">
                                                {item.product.image ? (
                                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FaBoxOpen />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{item.product.name}</h4>
                                                    <span className="flex-shrink-0 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-bold">x{item.product.quantity}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2">{item.product.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleOrderStatusChange(selectedOrder.orderId, 'Rejected')}
                                    className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-200 hover:shadow-lg active:scale-95 duration-200 flex-1 sm:flex-none"
                                >
                                    Reject Order
                                </button>
                                <button
                                    onClick={() => handleOrderStatusChange(selectedOrder.orderId, 'Approved')}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl active:scale-95 duration-200 flex-1 sm:flex-none"
                                >
                                    Approve Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
