import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthProvider";
import { GetUserData } from "../API/GetUsreData";


export default function LoginPage() {
useEffect(()=>{window.scroll(0,0)})

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
   onSubmit: async (values) => {
  const users = await GetUserData();
  const matchedUser = users.find(
    (user) => user.email === values.email && user.password === values.password
  );

  if (matchedUser) {
    login({userid:matchedUser.id,name:matchedUser.name});
    
    alert("Login Successful 🎉");
    navigate("/");
  } else {
    alert("Invalid email or password 🚫");
  }
},
  });

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left brand */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <img
                src="https://mohamedsaber.net/wp-content/uploads/2020/08/f-1.jpg"
                alt="Brand Logo"
                className="w-40 h-auto rounded-xl mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-800 mt-2">
                Login to your MobileMart account
              </p>
            </motion.div>
          </div>

          {/* Right login form */}
          <div className="w-full md:w-1/2 p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Login
              </h2>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border 
                      ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-700'}
                      focus:outline-none focus:border-yellow-500`}
                  />
                  <div className="min-h-[1.25rem]">
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-400 text-xs">{formik.errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border 
                      ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-700'}
                      focus:outline-none focus:border-yellow-500`}
                  />
                  <div className="min-h-[1.25rem]">
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-400 text-xs">{formik.errors.password}</p>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition shadow-md"
                >
                  Login
                </motion.button>
              </form>

              <p className="text-gray-400 text-center mt-6 text-sm">
                New to MobileMart?{" "}
                <Link
                  to="/register"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}