export default function PriceFilter({ priceRange, setPriceRange }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
      .format(price);

  return (
    <div className="w-full md:w-96">
      <h3 className="text-lg font-medium mb-2">Price Range (₹)</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 font-medium">{formatPrice(priceRange[0])}</span>
          <span className="text-yellow-400 font-medium">{formatPrice(priceRange[1])}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="200000"
          step="5000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>10K</span><span>50K</span><span>1L</span><span>1.5L</span><span>2L</span>
        </div>
      </div>
    </div>
  );
}