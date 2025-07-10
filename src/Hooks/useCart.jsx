// hooks/useCart.js
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function useCart() {
  const { user, setcartlength } = useContext(AuthContext);
  const navigate = useNavigate();

  const addToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Fetch latest user data
      const res = await axios.get(`http://localhost:3000/users/${user.userid}`);
      const userData = res.data;

      const updatedCart = [...(userData.cart || []), product];
      await axios.patch(`http://localhost:3000/users/${user.userid}`, {
        cart: updatedCart,
      });

      setcartlength(updatedCart.length);

   toast.success(`${product.name} added to cart 🎉`);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  return { addToCart };
}

