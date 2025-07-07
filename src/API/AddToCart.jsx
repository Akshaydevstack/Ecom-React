import axios from "axios";
export const addToCart = async (product) => {
 
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    console.log(storedUser);
    navigate("/login");
    return;
  }

  try {
    // Fetch user to get latest cart
    const res = await axios.get(
      `http://localhost:3000/users/${storedUser.userid}`
    );
    const userData = res.data;

    const updatedCart = [...(userData.cart || []), product];
    
    await axios.patch(`http://localhost:3000/users/${storedUser.userid}`, {
      cart: updatedCart,
    });
    alert(`${product.name} added to cart 🎉`);
  } catch (err) {
    console.error("Add to cart error:", err);
  }
  
};
