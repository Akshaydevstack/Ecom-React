import axios from "axios";

export async function GetUserData() {
  try {
    const response = await axios.get("http://localhost:3000/users");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}