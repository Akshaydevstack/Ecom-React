import axios from "axios";

export async function GetProduct() {
  try {
    const response = await axios.get("http://localhost:3000/products");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
