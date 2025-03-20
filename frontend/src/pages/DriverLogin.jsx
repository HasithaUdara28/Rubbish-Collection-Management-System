import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserIcon, TruckIcon, LockIcon, MailIcon } from 'lucide-react';

const DriverLogin = () => {
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
    setErrorMessage("");
    
    try {
      const response = await axios.post("http://localhost:5555/drivers/login", {
        email,
        password,
      });

      const token = response.data.token;
      sessionStorage.setItem("token", token);
      navigate("/driver-dashboard");
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
      <div className="w-full max-w-4xl flex overflow-hidden rounded-2xl shadow-xl">
        {/* Left side - Image/Illustration */}
        <div className="hidden md:block w-1/2 bg-green-600 p-8 text-white relative">
          <div className="absolute top-8 left-8">
            <h2 className="text-3xl font-bold">EcoCollect</h2>
            <p className="mt-2 text-green-100">Driver Portal</p>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <TruckIcon size={80} className="mx-auto mb-6 text-white opacity-90" />
              <h3 className="text-2xl font-semibold mb-4">Welcome Back!</h3>
              <p className="text-green-100">
                Log in to access your dashboard, manage your schedule, and track your earnings.
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-sm text-green-100">
              "Driving the green revolution - one pickup at a time."
            </p>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Driver Login</h1>
            <p className="text-gray-600">Access your EcoCollect dashboard</p>
          </div>
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={onSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${
                isLoading 
                  ? "bg-green-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              }`}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/driver-register" className="text-green-600 font-medium hover:text-green-800">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;