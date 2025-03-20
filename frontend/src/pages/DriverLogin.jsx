import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5555/drivers/login", {
        email,
        password,
      });

      const token = response.data.token;

      // Store the token securely in sessionStorage
      sessionStorage.setItem("token", token);

      // Navigate to the Driver Dashboard after login
      navigate("/driver-dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative flex w-full max-w-3xl bg-white rounded-lg shadow-lg h-[700px]">
        {/* Top-Right Image - Card */}
        <div className="absolute top-[1px] right-[-250px] z-0">
          <img src="Card.png" alt="Card Top Right" className="h-96" />
        </div>

        {/* Bottom-Left Image - Card2 */}
        <div className="absolute bottom-[1px] left-[-250px] z-0">
          <img src="Card2.png" alt="Card Bottom Left" className="h-96" />
        </div>

        {/* Login Form Section */}
        <div className="flex flex-col items-center w-full bg-green-100 rounded-lg p-8 z-10">
          <div className="mb-4">
            <img src="logos.png" alt="Logo" className="h-16" />
          </div>

          <h1 className="text-3xl font-bold text-green-600">ECOCOLLECT</h1>

          <div className="w-full max-w-sm mt-28">
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-semibold text-green-600">
                Driver Login
              </h1>
              <p className="text-gray-600">Access your driver dashboard</p>
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-4 mt-16">
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 mt-6 rounded-md hover:bg-green-700 transition"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
