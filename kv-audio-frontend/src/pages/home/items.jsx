import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function Items() {
  const [state, setState] = useState("loading"); // loading, success, error
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (state === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/get/`)
        .then((res) => {
          setItems(res.data);
          setState("success");
          console.log(res.data);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
            "Error fetching items: Contact Admin"
          );
          setState("error");
        });
    }
  }, []);

  // Extract unique categories and count products per category
  const categories = useMemo(() => {
    const categoryMap = {};
    items.forEach((item) => {
      const cat = item.category || "uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, count]) => ({ name, count }));
  }, [items]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-br from-primary via-primary to-secondary/30 text-text pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-6 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm shadow-sm shadow-accent/10">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            Browse our collection
          </div>
          <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text bg-gradient-to-r from-text to-text/80 bg-clip-text">
            Items & Equipment
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-text/65 max-w-3xl leading-relaxed">
            High-quality audio and event gear ready for your next booking. Browse by category and tap an item to view full details.
          </p>
        </section>

        {/* Category Filter */}
        {state === "success" && items.length > 0 && (
          <section className="mb-8 sm:mb-10 md:mb-14">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-text">Filter by Category</h2>
            </div>

            <div className="relative">
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
                {/* All Categories Button */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex-shrink-0 min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm transition-all duration-300 border-2 backdrop-blur-sm ${selectedCategory === "all"
                    ? "bg-gradient-to-r from-accent via-accent/95 to-accent/90 text-white border-accent shadow-xl shadow-accent/50 scale-105 -translate-y-0.5"
                    : "bg-white/75 text-text border-secondary/40 hover:bg-white hover:border-accent/40 hover:scale-105 hover:shadow-lg active:scale-95"
                    }`}
                >
                  All <span className="ml-1.5 sm:ml-2 text-xs opacity-90 font-black">({items.length})</span>
                </button>

                {/* Individual Category Buttons */}
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex-shrink-0 min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm transition-all duration-300 border-2 capitalize backdrop-blur-sm ${selectedCategory === category.name
                      ? "bg-gradient-to-r from-accent via-accent/95 to-accent/90 text-white border-accent shadow-xl shadow-accent/50 scale-105 -translate-y-0.5"
                      : "bg-white/75 text-text border-secondary/40 hover:bg-white hover:border-accent/40 hover:scale-105 hover:shadow-lg active:scale-95"
                      }`}
                  >
                    {category.name} <span className="ml-1.5 sm:ml-2 text-xs opacity-90 font-black">({category.count})</span>
                  </button>
                ))}
              </div>

              {/* Scroll Gradient Indicators */}
              <div className="absolute right-0 top-0 bottom-3 w-12 sm:w-20 bg-gradient-to-l from-primary via-primary/80 to-transparent pointer-events-none" />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="mt-6 sm:mt-8">
          {/* Loading state */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24 gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-secondary/30 border-t-accent rounded-full animate-spin" />
                <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 border-4 border-transparent border-b-accent/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              </div>
              <p className="text-sm sm:text-base text-text/60 font-semibold">Loading items...</p>
            </div>
          )}

          {/* Error state */}
          {state === "error" && (
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300/40 px-5 py-7 sm:px-6 sm:py-8 md:px-8 md:py-10 max-w-xl mx-auto text-center shadow-xl shadow-red-100/50 backdrop-blur-sm">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-red-700">
                Unable to load items
              </h2>
              <p className="mt-3 text-sm text-red-600/80 leading-relaxed">
                Please try again in a moment or contact the administrator if the
                issue continues.
              </p>
            </div>
          )}

          {/* Items grid with animation */}
          {state === "success" && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          )}

          {/* Empty filtered state */}
          {state === "success" && items.length > 0 && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary/60 to-secondary/30 text-text/50 flex items-center justify-center mb-5 shadow-lg border border-secondary/40 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-text">
                No items in this category
              </h2>
              <p className="mt-3 text-base text-text/60 max-w-md leading-relaxed">
                Try selecting a different category to browse more items.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-8 px-8 py-3.5 bg-gradient-to-r from-accent to-accent/90 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-accent/30"
              >
                View All Items
              </button>
            </div>
          )}

          {/* Empty state - no items at all */}
          {state === "success" && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-secondary/60 to-secondary/30 flex items-center justify-center mb-5 shadow-lg border border-secondary/40 backdrop-blur-sm">
                <span className="text-4xl">🎧</span>
              </div>
              <h2 className="text-xl font-black text-text">
                No items available yet
              </h2>
              <p className="mt-3 text-base text-text/60 max-w-md leading-relaxed">
                Check back soon. New items and equipment will appear here as they
                are added.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thumb-accent::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #3F72AF, rgba(63, 114, 175, 0.8));
          border-radius: 10px;
        }
        .scrollbar-thumb-accent::-webkit-scrollbar-thumb:hover {
          background: #3F72AF;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </main>
  );
}
