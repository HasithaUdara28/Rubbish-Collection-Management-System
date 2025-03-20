import React, { useState } from "react";
import axios from "axios";

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    licenceNumber: "",
    vehicleCapacity: "",
  });

  const { name, email, password, licenceNumber, vehicleCapacity } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5555/drivers/register", {
        name,
        email,
        password,
        licenceNumber,
        vehicleCapacity,
        role: "driver",
      });

      const token = response.data.token;
      sessionStorage.setItem("token", token);
      console.log("Driver Registered", token);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg h-[750px] relative">
        {/* Top-Right Image - Card */}
        <div className="absolute top-[1px] right-[-250px] z-0">
          <img src="Card.png" alt="Card Top Right" className="h-96" />
        </div>

        {/* Bottom-Left Image - Card2 */}
        <div className="absolute bottom-[1px] left-[-250px] z-0">
          <img src="Card2.png" alt="Card Bottom Left" className="h-96" />
        </div>

        {/* Register Form Section */}
        <div className="flex flex-col items-center w-full bg-green-100 rounded-lg p-8 z-10">
          {/* Logo at the Top */}
          <div className="mb-4">
            <img src="logos.png" alt="Logo" className="h-16" />
          </div>

          <h1 className="text-3xl font-bold text-green-600">ECOCOLLECT</h1>

          {/* Form Content */}
          <div className="w-full max-w-sm mt-10">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-semibold text-green-600">Driver Registration</h1>
              <p className="text-gray-600">Join as a verified driver</p>
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
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
                  placeholder="Create a secure password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Licence Number</label>
                <input
                  type="text"
                  name="licenceNumber"
                  value={licenceNumber}
                  onChange={onChange}
                  placeholder="Enter your driving licence number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700">Vehicle Capacity</label>
                <input
                  type="text"
                  name="vehicleCapacity"
                  value={vehicleCapacity}
                  onChange={onChange}
                  placeholder="Enter vehicle capacity"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-green-700 transition"
              >
                Register as Driver
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
