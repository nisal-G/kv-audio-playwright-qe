import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";

export default function UpdateItemPage() {

  const location = useLocation();

  const [Key, setKey] = useState(location.state.key);
  const [productName, setProductName] = useState(location.state.name);
  const [price, setPrice] = useState(location.state.price);
  const [category, setCategory] = useState(location.state.category);
  const [dimensions, setDimensions] = useState(location.state.dimensions);
  const [description, setDescription] = useState(location.state.description);
  const [productImages, setProductImages] = useState([]);

  const navigate = useNavigate();

  async function handleUpdateItem(e) {

    e.preventDefault();

    //set Images to existing images if no new images are selected
    let updatingImages = location.state.image;


    if (productImages.length > 0) {

      const promises = [];
      for (let i = 0; i < productImages.length; i++) {
        console.log("Uploading image:", productImages[i])
        const promise = mediaUpload(productImages[i]);
        promises.push(promise);
      }

      updatingImages = await Promise.all(promises); // Wait for all uploads to complete`  
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const result = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/update/${Key}`, {
          name: productName,
          price: price,
          category: category,
          dimensions: dimensions,
          description: description,
          image: updatingImages
        }, {
          headers: {
            Authorization: "Bearer " + token
          }
        });

        console.log("Backend response:", result.data);
        toast.success("Item Updated successfully!");
        navigate('/admin/items');

      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred while updating the item.");
      }
    } else {
      toast.error("You must be logged in to update an item.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Update Item</h2>
          <p className="text-blue-100 mt-2 text-sm">Edit product details and update inventory.</p>
        </div>

        <div className="p-8">
          <form className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Key - Read Only */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Product Key</label>
                <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 font-mono text-sm">
                  {Key}
                  <span className="ml-auto text-xs font-semibold bg-gray-200 px-2 py-0.5 rounded text-gray-600">ID</span>
                </div>
              </div>

              {/* Product Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="e.g. Sony WH-1000XM5"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-medium">Rs.</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none text-gray-800 cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="speakers">Speakers</option>
                    <option value="headphones">Headphones</option>
                    <option value="microphones">Microphones</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800"
                  placeholder="L x W x H (cm)"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-800 min-h-[100px]"
                  placeholder="Describe the product features and specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-blue-300 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-500 group-hover:text-blue-600">
                        {productImages && productImages.length > 0
                          ? <span className="text-blue-600 font-semibold">{productImages.length} file(s) selected</span>
                          : <span>Select new images to replace existing ones</span>}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      multiple
                      onChange={(e) => setProductImages(Array.from(e.target.files))}
                    />
                  </label>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/admin/items')}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                type="submit"
                className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

