import React, { useEffect, useState } from "react";
import BannerSlider from "../Component/BannerSliders/BannerSliderHome";
import PopularMobiles from "../Component/HomeComponents/PopularMobilesHome";
import PremiumPicks from "../Component/HomeComponents/PremiumPicksHome";
import { GetProduct } from "../API/GetProducts";
import BannerOfferslider from "../Component/BannerSliders/BannerOfferslider";
export default function HomePage() {
  const [homeProducts, sethomeProducts] = useState([]);
  const [featuredItems, setfeaturedItems] = useState([]);

  useEffect(() => {
    GetProduct()
      .then((res) => {
        sethomeProducts(res);
        setfeaturedItems(res.slice(12, 16));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-black text-white ">
     <BannerOfferslider/>
      {/* Hero Section */}
      <BannerSlider />
      {/* Product Grid */}
      <PopularMobiles homeProducts={homeProducts} />

      {/* Horizontal Featured Styles */}
      <PremiumPicks featuredItems={featuredItems} />
    </div>
  );
}
