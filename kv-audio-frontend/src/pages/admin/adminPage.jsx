import { Link, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MdDashboard, MdBookmark, MdDevices, MdPerson, MdStar, MdMenu, MdClose, MdLogout } from 'react-icons/md';
import AdminItemsPage from './adminItemsPage';
import AddItemPage from './addItemPage';
import UpdateItemPage from './updateItemsPage';
import AdminUsersPage from './adminUsersPage';
import AdminOrdersPage from './adminBookingPage';
import AdminReviewsPage from './adminReviewsPage';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
    users: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const [productsRes, ordersRes, reviewsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/get`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/get`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/get`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const pendingOrders = ordersRes.data.filter(order => order.status === 'Pending' || order.status === 'pending').length;
        const pendingReviews = reviewsRes.data.filter(review => !review.isApproved).length;

        setStats({
          products: productsRes.data.length,
          orders: pendingOrders,
          reviews: pendingReviews,
          users: usersRes.data.length,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: MdDevices,
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      link: '/admin/items'
    },
    {
      title: 'Pending Orders',
      value: stats.orders,
      icon: MdBookmark,
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      link: '/admin/orders'
    },
    {
      title: 'Pending Reviews',
      value: stats.reviews,
      icon: MdStar,
      gradient: 'from-amber-500 to-amber-700',
      bgGradient: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-600',
      link: '/admin/reviews'
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: MdPerson,
      gradient: 'from-emerald-500 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      link: '/admin/users'
    }
  ];

  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
      {/* Top Bar with decorative background */}
      <div className="w-full h-[300px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

      <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3 mb-2">
            <MdDashboard className="text-white/80" size={36} />
            Admin Dashboard
          </h1>
          <p className="text-white/80 text-sm md:text-base">Welcome back! Here's an overview of your store.</p>
        </div>

        {/* Stats Grid */}
        {stats.loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/80 font-medium">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in-50 duration-500">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  to={card.link}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className={`${card.textColor} opacity-20 group-hover:opacity-30 transition-opacity`}>
                        <Icon size={64} />
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wide mb-2">{card.title}</h3>
                    <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in fade-in-50 duration-700">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/addItems" className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-200 border border-blue-200 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MdDevices size={20} />
              </div>
              <span className="font-semibold text-gray-700">Add New Product</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-200 border border-purple-200 group">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MdBookmark size={20} />
              </div>
              <span className="font-semibold text-gray-700">View Orders</span>
            </Link>
            <Link to="/admin/reviews" className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-md transition-all duration-200 border border-amber-200 group">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MdStar size={20} />
              </div>
              <span className="font-semibold text-gray-700">Manage Reviews</span>
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-md transition-all duration-200 border border-emerald-200 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <MdPerson size={20} />
              </div>
              <span className="font-semibold text-gray-700">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/get`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(response => {
      const user = response.data;
      if (user.role === 'Admin') {
        setUserValidated(true);
      } else {
        window.location.href = '/login';
      }
    })
      .catch(error => {
        console.error('Error validating user:', error);
        window.location.href = '/login';
      });
  }, []);

  const navItems = [
    { path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: MdBookmark, label: 'Orders' },
    { path: '/admin/items', icon: MdDevices, label: 'Products' },
    { path: '/admin/users', icon: MdPerson, label: 'Users' },
    { path: '/admin/reviews', icon: MdStar, label: 'Reviews' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] h-screen 
        bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        shadow-2xl
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/KV_Audio_Logo.png"
                alt="KV Audio Admin"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">KV AUDIO</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-xs text-blue-200 font-medium tracking-wider uppercase">Admin Panel</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white transition-colors"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${active
                    ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                  group relative overflow-hidden
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"></div>
                )}
                <Icon className={`
                  text-2xl relative z-10 transition-transform duration-200
                  ${active ? 'scale-110' : 'group-hover:scale-110'}
                `} />
                <span className="text-base font-semibold relative z-10">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse relative z-10"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-200 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          >
            <MdLogout className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdMenu size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <MdDashboard className="text-white" size={18} />
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {userValidated && (
            <Routes path="/*">
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/items" element={<AdminItemsPage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/reviews" element={<AdminReviewsPage />} />
              <Route path="/addItems" element={<AddItemPage />} />
              <Route path="/updateItems" element={<UpdateItemPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
