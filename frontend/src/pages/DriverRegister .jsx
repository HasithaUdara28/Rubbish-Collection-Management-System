import React, { useState } from "react";
import axios from "axios";

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    licenceNumber: "",
    vehicleType: "",
    locations: [],
    services: []
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { name, email, password, licenceNumber, vehicleType, locations, services } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLocationChange = (e) => {
    setFormData({ ...formData, locations: e.target.value.split(",").map(loc => loc.trim()) });
  };

  const onServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        return { ...prevState, services: [...prevState.services, value] };
      } else {
        return { ...prevState, services: prevState.services.filter(service => service !== value) };
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5555/drivers/register", {
        name,
        email,
        password,
        licenceNumber,
        vehicleType,
        locations,
        services
      });

      console.log("Driver Registered:", response.data.message);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const vehicleOptions = ["Car", "Van", "Small Truck", "Medium Truck", "Large Truck"];
  const availableServices = ['Half Truck', 'Full Truck', 'More Than Truck'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Brand Info */}
          <div className="bg-green-600 text-white md:w-1/3 p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-6">ECOCOLLECT</h1>
              <p className="text-green-100 mb-4">Join our network of professional drivers and help make waste collection more efficient.</p>
              <div className="space-y-4 mt-8">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Flexible work schedule</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Competitive earnings</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <span>Support environmental causes</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-sm">
              <p>Already registered? <a href="driverlogin" className="text-white font-bold underline">Login here</a></p>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="md:w-2/3 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Driver Registration</h2>
              <p className="text-gray-600">Join as a verified waste collection driver</p>
            </div>

            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Registration Successful!</p>
                <p>Your driver account has been created. Our team will verify your details shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={name} 
                      onChange={onChange} 
                      placeholder="Enter your full name" 
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={email} 
                      onChange={onChange} 
                      placeholder="Enter your email" 
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={onChange} 
                    placeholder="Create a secure password" 
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Licence Number</label>
                    <input 
                      type="text" 
                      name="licenceNumber" 
                      value={licenceNumber} 
                      onChange={onChange} 
                      placeholder="Enter your driving licence number" 
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={vehicleType}
                      onChange={onChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      required
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {vehicleType === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify vehicle type"
                        className="mt-2 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Locations (comma-separated)</label>
                  <input 
                    type="text" 
                    name="locations" 
                    value={locations.join(",")} 
                    onChange={onLocationChange} 
                    placeholder="E.g., Downtown, North Side, West End" 
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                    required 
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter the areas where you can provide service</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {availableServices.map(service => (
                      <div key={service} className="flex items-center">
                        <input 
                          id={service}
                          type="checkbox" 
                          value={service} 
                          checked={services.includes(service)} 
                          onChange={onServiceChange} 
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" 
                        />
                        <label htmlFor={service} className="ml-2 block text-sm text-gray-700">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Register as Driver'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By registering, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;