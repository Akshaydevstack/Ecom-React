import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartlength,setcartlength]= useState(7)
  const navigate=useNavigate()
  


  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    navigate("/")
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout , cartlength, setcartlength }}>
      {children}
    </AuthContext.Provider>
  );
}
