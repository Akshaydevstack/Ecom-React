import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartlength, setcartlength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Fetch latest cart from server
      fetch(`http://localhost:3000/users/${userData.userid}`)
        .then((res) => res.json())
        .then((data) => {
          setcartlength(data.cart ? data.cart.length : 0);
        })
        .catch((err) => console.log("Failed to load cart:", err));
    }
  }, []);

  // Sync user to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login with userData
  const login = (userData) => {
    setUser(userData);
  };

  // Register does the same (for simplicity)
  const register = (userData) => {
    setUser(userData);
  };

  // Logout clears user
  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, cartlength, setcartlength }}
    >
      {children}
    </AuthContext.Provider>
  );
}
