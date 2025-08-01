import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "../Data/Api_EndPoint";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cartlength, setcartlength] = useState(0);
  const [abandoned, setabandoned] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetch(`${UserApi}/${user.userid}`)
        .then((res) => res.json())
        .then((data) => {
          setcartlength(data.cart ? data.cart.length : 0);
        })
        .catch((err) => console.log("Failed to load cart:", err));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login sets user
  const login = (userData) => {
    setUser(userData);
  };

  // Register same
  const register = (userData) => {
    setUser(userData);
  };

  // Logout clears
  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, cartlength, setcartlength ,abandoned, setabandoned}}
    >
      {children}
    </AuthContext.Provider>
  );
}
