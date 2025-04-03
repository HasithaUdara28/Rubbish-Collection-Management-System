import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5555/user/login", {
        email,
        password,
      });

      const token = response.data.token;
      sessionStorage.setItem("token", token);
      navigate("/home");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden h-[600px] relative">
        {/* Left Side - Image/Brand Section */}
        <div className="hidden md:block w-2/5 bg-green-600 text-white p-12 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <img src="bgimg.png" alt="Background Pattern" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <img src="logoo.png" alt="Logo" className="h-28 mb-2" />
            <h2 className="text-3xl font-bold mb-6">ECOCOLLECT</h2>
            <p className="text-lg opacity-90 mb-4">Welcome back to your sustainable waste management solution</p>
            <p className="text-sm opacity-80 mt-20">Making recycling easy and rewarding for communities worldwide.</p>
            
            <div className="absolute bottom-12 left-12">
              <div className="flex space-x-2 mt-12">
                <div className="h-1 w-12 bg-white rounded-full opacity-100"></div>
                <div className="h-1 w-4 bg-white rounded-full opacity-50"></div>
                <div className="h-1 w-4 bg-white rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-3/5 bg-white p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="md:hidden mb-8 text-center">
              <img src="logos.png" alt="Logo" className="h-14 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-green-600">ECOCOLLECT</h2>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Please sign in to your account</p>
            
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="/forgot-password" className="text-xs text-green-600 hover:text-green-800">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Sign In"}
              </button>
            </form>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-green-600 hover:text-green-500">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;