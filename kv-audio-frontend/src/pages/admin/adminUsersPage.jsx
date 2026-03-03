import axios from "axios";
import { useEffect, useState } from "react";
import { MdPerson, MdSearch, MdFilterList, MdBlock, MdCheckCircle, MdMoreVert, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

export default function AdminUsersPage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response.data);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
                toast.error("Failed to load users");
            }
        };

        if (loading) {
            fetchUsers();
        }
    }, [loading]);


    // Function to block a user
    function handleBlockUser(email) {

        const token = localStorage.getItem('token');
        const userToUpdate = users.find(u => u.email === email);
        const action = userToUpdate.isBlocked ? "unblocked" : "blocked";

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/block/${email}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data);
            toast.success(`User ${action} successfully`);
            setLoading(true);
        }).catch(error => {
            console.error('Error blocking user:', error);
            toast.error(`Failed to ${action} user`);
        });
    }

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
            {/* Top Bar with decorative background */}
            <div className="w-full h-[300px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

            <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <MdPerson className="text-white/80" />
                        User Management
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                            {users.length} users
                        </span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdSearch className="text-blue-200 group-focus-within:text-white transition-colors text-xl" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-blue-400/30 rounded-xl leading-5 bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 focus:ring-1 focus:ring-white/50 focus:border-white/50 sm:text-sm backdrop-blur-sm transition-all shadow-sm"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <p className="text-white/80 font-medium">Loading users...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in-50 duration-500">
                        {users.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <MdPerson size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No users found</h3>
                                <p className="text-gray-500 max-w-sm">Users will appear here once they register.</p>
                            </div>
                        ) : (
                            <div className="overflow-auto custom-scrollbar flex-1">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 shadow-sm">
                                        <tr>
                                            {['User', 'Status', 'Role', 'Contact Info', 'Location', 'Actions'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-8">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="group hover:bg-blue-50/50 transition-all duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap first:pl-8">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform duration-300"
                                                                src={user.profilePicture}
                                                                alt={`${user.firstName}`}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Joined {new Date().toLocaleDateString()} {/* Assuming date field exists or just mockup */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.isBlocked
                                                            ? 'bg-red-50 text-red-700 border-red-100'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                                                            }`}></span>
                                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${user.role === 'Admin'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-900">{user.email}</span>
                                                        <span className="text-xs text-gray-500">{user.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-500 max-w-[150px] truncate block" title={user.address}>
                                                        {user.address}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleBlockUser(user.email)}
                                                        className={`group/btn relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${user.isBlocked
                                                                ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                                : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                                                            }`}
                                                        title={user.isBlocked ? "Unblock User" : "Block User"}
                                                    >
                                                        {user.isBlocked ? (
                                                            <MdCheckCircle size={20} />
                                                        ) : (
                                                            <MdBlock size={20} />
                                                        )}
                                                        <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            {user.isBlocked ? "Unblock" : "Block"}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                    No users found matching "{searchTerm}"
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> users
                            </p>
                            <div className="flex gap-2">
                                {/* Pagination placeholders if needed in future */}
                                <button className="px-3 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md shadow-sm opacity-50 cursor-not-allowed">Previous</button>
                                <button className="px-3 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md shadow-sm opacity-50 cursor-not-allowed">Next</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}