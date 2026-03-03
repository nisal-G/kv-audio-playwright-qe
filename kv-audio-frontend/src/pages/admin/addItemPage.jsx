import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";
import { MdAddBox, MdClose, MdImage, MdArrowBack } from "react-icons/md";

export default function AddItemPage() {
  const [Key, setKey] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleAddItem(e) {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Product Images:", productImages);
    const promises = [];
    for (let i = 0; i < productImages.length; i++) {
      console.log("Uploading image:", productImages[i])
      const promise = mediaUpload(productImages[i]);
      promises.push(promise);
    }


    const token = localStorage.getItem('token');

    if (token) {
      try {

        // Wait for all uploads to complete | Promise.all is used to handle multiple promises
        // Promise.all(promises)
        //   .then((results) => {
        //     console.log(results);
        //   }). catch((error) => {
        //     toast.error("Error uploading images:", error);
        //   });

        const uploadedImageUrls = await Promise.all(promises); // Wait for all uploads to complete


        const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products/`, {
          key: Key,
          name: productName,
          price: price,
          category: category,
          dimensions: dimensions,
          description: description,
          image: uploadedImageUrls
        },
          {
            headers: {
              Authorization: "Bearer " + token
            }
          });

        console.log("Backend response:", result.data);
        toast.success("Item added successfully!");
        navigate('/admin/items');

      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred while adding the item.");
        setIsSubmitting(false);
      }
    } else {
      toast.error("You must be logged in to add an item.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 relative overflow-hidden flex flex-col">
      {/* Top Bar with decorative background */}
      <div className="w-full h-[200px] bg-gradient-to-r from-blue-600 to-blue-800 absolute top-0 left-0 z-0 rounded-b-[40px] shadow-lg"></div>

      <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="w-full max-w-2xl mb-6">
          <button
            onClick={() => navigate('/admin/items')}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4 group"
          >
            <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Products</span>
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MdAddBox className="text-white/90" size={32} />
            Add New Product
          </h1>
          <p className="text-white/80 text-sm mt-2">Fill in the details to add a new product to your inventory</p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in-50 duration-500">
          <form onSubmit={handleAddItem} className="p-8 space-y-6">

            {/* Product Key & Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Key */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="e.g., SP-001"
                  value={Key}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="e.g., Premium Speaker"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
            </div>

            {/* Price & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="speakers">Speakers</option>
                  <option value="headphones">Headphones</option>
                  <option value="microphones">Microphones</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
            </div>

            {/* Product Dimensions */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Dimensions
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="e.g., 10 x 15 x 20 cm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows="4"
                placeholder="Describe the product features, specifications, and benefits..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Images
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                  onChange={(e) => setProductImages(Array.from(e.target.files))}
                />
              </div>
              {productImages.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <MdImage className="text-blue-500" />
                  <span className="font-medium">{productImages.length} image{productImages.length > 1 ? 's' : ''} selected</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/items')}
                className="flex-1 sm:flex-none px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                <MdClose size={20} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <MdAddBox size={20} />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
