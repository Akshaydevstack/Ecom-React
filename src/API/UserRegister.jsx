import axios from "axios";

export default async function UserRegister(formData) {
  try {
    const response = await axios.post("http://localhost:3000/users", formData);
    return response.data;  
  } catch (err) {
    console.error("Registration failed:", err.message);
    throw err; 
  }
}