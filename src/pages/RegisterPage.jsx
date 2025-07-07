import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthProvider";
import { user } from "../../Data/userTemplate";
import UserRegister from "../API/UserRegister";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: user,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const userData = await UserRegister(values);
      register({userid:userData.id,name:userData.name});
      alert("Registration Successful 🎉");
      console.log(values);
      navigate("/");
    },
  });

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "linear-gradient(135deg, #312e81, #1e293b, #0f172a)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Brand */}
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
                className="w-48 h-auto rounded-xl mx-auto mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900">
                Join MobileMart
              </h2>
              <p className="text-gray-800 mt-2">Create your account today</p>
            </motion.div>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Create Account
              </h2>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border 
                      ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : "border-gray-700"
                      }
                      focus:outline-none focus:border-yellow-500`}
                  />
                  <div className="min-h-[1.25rem]">
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-400 text-xs">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border 
                      ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-gray-700"
                      }
                      focus:outline-none focus:border-yellow-500`}
                  />
                  <div className="min-h-[1.25rem]">
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-400 text-xs">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border 
                      ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : "border-gray-700"
                      }
                      focus:outline-none focus:border-yellow-500`}
                  />
                  <div className="min-h-[1.25rem]">
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-400 text-xs">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition shadow-md"
                >
                  Register
                </motion.button>
              </form>

              <p className="text-gray-400 text-center mt-6 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
