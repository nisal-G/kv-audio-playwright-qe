import axios from "axios";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdStar, MdStarBorder, MdRateReview } from "react-icons/md";

export default function AdminReviewsPage() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (loading) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                console.log("Fetched reviews:", response.data);
                setReviews(response.data);
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching reviews:", error);
                setLoading(false);
            });
        }
    }, [loading]);

    // Handle review status update
    function handleReviewStatusChange(reviewId, isApproved) {
        const token = localStorage.getItem('token');

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/updateStatus/${reviewId}`, {
            isApproved: isApproved
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log("Review status updated:", response.data);
            setSelectedReview(null); // Close modal
            setLoading(true); // Trigger re-fetch of reviews
        }).catch(error => {
            console.error("Error updating review status:", error);
        });
    }

    // Render star rating
    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating
                    ? <MdStar key={i} className="text-yellow-400" />
                    : <MdStarBorder key={i} className="text-gray-300" />
            );
        }
        return stars;
    }

    return (
        <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
            {/* Top Bar with decorative background */}
            <div className="w-full h-[300px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

            <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <MdRateReview className="text-white/80" />
                        Reviews Management
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                            {reviews.length} reviews
                        </span>
                    </h1>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <p className="text-white/80 font-medium">Loading reviews...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in-50 duration-500">
                        {reviews.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <MdRateReview size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No reviews found</h3>
                                <p className="text-gray-500 max-w-sm">It seems there are no reviews submitted yet. New reviews will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="overflow-auto custom-scrollbar flex-1">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 shadow-sm">
                                        <tr>
                                            {['Name', 'Email', 'Rating', 'Comment', 'Date', 'Status'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-8">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reviews.map((review) => (
                                            <tr
                                                key={review._id}
                                                onClick={() => setSelectedReview(review)}
                                                className="group hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                                            >
                                                <td className="px-6 py-4 first:pl-8">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={review.profilePicture}
                                                            alt={review.name}
                                                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                                                        />
                                                        <span className="font-semibold text-gray-900">{review.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <span className="truncate max-w-[200px] block" title={review.email}>{review.email}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(review.rating)}
                                                        <span className="ml-2 text-sm font-semibold text-gray-700">({review.rating})</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                                    <p className="truncate">{review.comment}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${review.isApproved
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full mr-2 ${review.isApproved ? 'bg-emerald-500' : 'bg-amber-500'
                                                            }`}></span>
                                                        {review.isApproved ? 'Approved' : 'Pending'}
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

            {/* Review Details Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <MdRateReview size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Review Details</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-500">Submitted on:</span>
                                        <span className="text-sm font-medium text-gray-700">{new Date(selectedReview.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar bg-white/50">
                            {/* Customer Info */}
                            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedReview.profilePicture}
                                        alt={selectedReview.name}
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedReview.name}</h3>
                                        <p className="text-sm text-gray-600">{selectedReview.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-8">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Rating</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-3xl">
                                        {renderStars(selectedReview.rating)}
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 ml-2">{selectedReview.rating}/5</span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-8">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Review Comment</p>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-800 leading-relaxed text-base">{selectedReview.comment}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Current Status</p>
                                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 shadow-sm ${selectedReview.isApproved
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    <span className={`w-3 h-3 rounded-full mr-2 ${selectedReview.isApproved ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`}></span>
                                    {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleReviewStatusChange(selectedReview._id, false)}
                                    className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-200 hover:shadow-lg active:scale-95 duration-200 flex-1 sm:flex-none"
                                >
                                    Reject Review
                                </button>
                                <button
                                    onClick={() => handleReviewStatusChange(selectedReview._id, true)}
                                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl active:scale-95 duration-200 flex-1 sm:flex-none"
                                >
                                    Approve Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom scrollbar styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
