import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { MdEdit, MdDelete, MdInventory } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (itemKey) => {
    console.log('Edit item:', itemKey);
    // TODO: Implement edit functionality
  };


  useEffect(() => {

    if (!itemsLoaded) {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      axios.get(`${backendUrl}/api/products/get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setItems(response.data);
        setItemsLoaded(true);
      }).catch(error => {
        console.error('Error fetching items:', error);
      });
    }
  }, [itemsLoaded]);


  const handleDelete = (key) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-4 min-w-[300px] p-4">
        <div className="text-gray-800 font-medium text-lg text-center">
          Are you sure you want to delete this item?
        </div>
        <p className="text-gray-500 text-sm text-center">
          This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(key);
            }}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-md shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#333',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
    });
  };

  const performDelete = (key) => {
    const token = localStorage.getItem("token");
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/delete/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(
      (res) => {
        console.log(res.data);
        setItems(items.filter((item) => item.key !== key));
        setItemsLoaded(false);
        toast.success("Item deleted successfully!");
      }
    ).catch(
      (err) => {
        console.error(err);
        toast.error("Failed to delete item.");
      }
    );
  };


  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
      {/* Top Bar with decorative background */}
      <div className="w-full h-[300px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

      <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MdInventory className="text-white/80" />
            Product Management
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
              {items.length} items
            </span>
          </h1>
          <Link to="/admin/addItems">
            <button className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold">
              <CiCirclePlus className="text-2xl" />
              <span>Add New Item</span>
            </button>
          </Link>
        </div>

        {/* Loading State */}
        {!itemsLoaded && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/80 font-medium">Loading products...</p>
            </div>
          </div>
        )}

        {/* Table Section */}
        {itemsLoaded && (
          <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in fade-in-50 duration-500">
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <MdInventory size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-500 max-w-sm">It seems there are no products yet. Add your first product to get started!</p>
              </div>
            ) : (
              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-20 shadow-sm">
                    <tr>
                      {['Item Key', 'Item Name', 'Price (LKR)', 'Category', 'Dimensions', 'Description', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider first:pl-8">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr
                        key={item.key}
                        className="group hover:bg-blue-50/50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold first:pl-8">{item.key}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          Rs. {item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.dimensions}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.description}>
                          {item.description}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${item.availability
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${item.availability ? 'bg-emerald-500' : 'bg-red-500'
                              }`}></span>
                            {item.availability ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                navigate('/admin/updateItems', { state: item })}
                              className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                              title="Edit item"
                            >
                              <MdEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.key)}
                              className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                              title="Delete item"
                            >
                              <MdDelete className="text-lg" />
                            </button>
                          </div>
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
  )
}
