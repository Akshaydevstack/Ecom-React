import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandFilter from "../Component/ShopComponents/BrandFilter";
import PriceFilter from "../Component/ShopComponents/PriceFilter";
import ProductGrid from "../Component/ShopComponents/OurMobileCollection";
import UpcomingProducts from "../Component/ShopComponents/UpcomingProducts";
import { GetProduct } from "../API/GetProducts";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([10000, 200000]);
  const navigate = useNavigate();

  useEffect(() => {
     window.scrollTo(0, 0);
       GetProduct()
      .then((res) => {
        setProducts(res);
        setFilteredProducts(res);
        setUpcomingProducts(res.slice(10, 14));
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (selectedBrand !== "All") {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }
    filtered = filtered.filter(product => {
      const price = parseInt(product.price.replace(/[^0-9]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredProducts(filtered);
  }, [selectedBrand, priceRange, products]);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="bg-gray-900 py-2 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <BrandFilter selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
          <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
          <div className="text-gray-400 text-sm">{filteredProducts.length} products found</div>
        </div>
      </div>
      <ProductGrid products={filteredProducts} navigate={navigate} setSelectedBrand={setSelectedBrand} setPriceRange={setPriceRange} />
      <UpcomingProducts upcomingProducts={upcomingProducts} />
    </div>
  );
}