export default function BrandFilter({ selectedBrand, setSelectedBrand }) {
  const brands = ["All", "Samsung", "iPhone", "OnePlus", "Realme", "Vivo", "Xiaomi"];

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Brand</h3>
      <div className="flex flex-wrap gap-2">
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedBrand === brand
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}