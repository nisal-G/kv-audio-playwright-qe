import { Link } from "react-router-dom";

export default function ProductCard(props) {

  const item = props.item;

  return (
    <div className="group w-full sm:max-w-[400px] mx-auto h-auto bg-white/85 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-secondary/40 hover:scale-[1.02] sm:hover:scale-[1.04] hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-accent/30">
      {/* Image Section with Gradient Overlay */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] bg-gradient-to-br from-secondary/40 to-accent/15 overflow-hidden">
        {item.image && item.image.length > 0 ? (
          <>
            <img
              src={item.image[0]}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Subtle gradient overlay for better badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Availability Badge with Glassmorphism */}
        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300 ${item.availability
          ? 'bg-emerald-500/95 text-white border-emerald-300/60 shadow-lg shadow-emerald-500/50 group-hover:shadow-xl group-hover:scale-110'
          : 'bg-red-500/95 text-white border-red-300/60 shadow-lg shadow-red-500/50'
          }`}>
          {item.availability ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              In Stock
            </span>
          ) : (
            '✗ Out of Stock'
          )}
        </div>

        {/* Category Badge with Enhanced Design */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold bg-gradient-to-r from-accent via-accent/95 to-accent/85 text-white capitalize shadow-lg shadow-accent/50 backdrop-blur-md border border-white/30 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
          {item.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col bg-gradient-to-br from-white via-white to-primary/40">
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl font-bold text-text mb-2 sm:mb-3 line-clamp-2 min-h-[48px] sm:min-h-[56px] leading-tight group-hover:text-accent transition-colors duration-300">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-text/70 text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 min-h-[40px] sm:min-h-[60px] leading-relaxed">
          {item.description || 'No description available'}
        </p>

        {/* Dimensions with Icon */}
        {item.dimensions && (
          <div className="flex items-center text-xs sm:text-sm text-text/60 mb-4 sm:mb-5 px-3 py-2 rounded-xl bg-secondary/40 backdrop-blur-sm group-hover:bg-secondary/50 transition-colors duration-300">
            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="truncate font-medium">{item.dimensions}</span>
          </div>
        )}

        {/* Price & CTA Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-5 border-t border-secondary/40 mt-auto gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-full sm:w-auto">
            <p className="text-xs text-text/50 font-semibold uppercase tracking-wider mb-1">Price</p>
            <p className="text-2xl sm:text-3xl font-black text-accent">
              <span className="text-sm sm:text-lg align-top">Rs.</span>{item.price.toLocaleString()}
            </p>
          </div>

          {/* View Details Button */}
          <Link to={"/product/" + item.key}
            className={`w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${item.availability
              ? 'bg-gradient-to-r from-accent via-accent/95 to-accent/90 hover:from-accent/95 hover:via-accent hover:to-accent text-white shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/60 sm:hover:scale-110 active:scale-95'
              : 'bg-secondary/50 text-text/40 cursor-not-allowed border border-secondary/60'
              }`}
            disabled={!item.availability}
          >
            {item.availability ? (
              <>
                View Details
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              'Unavailable'
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}