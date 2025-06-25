import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleDriverClick = () => {
    navigate('/driverlogin');
  };

  const handleCustomerClick = () => {
    navigate('/customerlogin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl w-full px-4">
       
        <div className="text-center mb-12">
          <img src="/logoo.png" alt="ECOCOLLECT Logo" className="h-28 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-600">ECOCOLLECT</h1>
          <p className="text-gray-600 text-xl mt-4">Sustainable waste management solution</p>
        </div>

        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
         
          <div 
            onClick={handleDriverClick}
            className="w-full md:w-1/2 bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="h-40 bg-green-700 relative">
              <div className="absolute inset-0 opacity-20">
                <img src="/driver.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m4 5v-5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Driver </h2>
              <p className="text-gray-600 mb-6">Manage your collection routes and pickups</p>
              <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
                Sign In as Driver
              </button>
            </div>
          </div>

          
          <div 
            onClick={handleCustomerClick}
            className="w-full md:w-1/2 bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="h-40 bg-green-600 relative">
              <div className="absolute inset-0 opacity-20">
                <img src="/customer.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer </h2>
              <p className="text-gray-600 mb-6">Schedule pickups and track your recycling</p>
              <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200">
                Sign In as Customer
              </button>
            </div>
          </div>
        </div>

        
        <div className="text-center mt-16 text-gray-600">
          <p>Making recycling easy and rewarding for communities in UK.</p>
          <div className="flex justify-center space-x-3 mt-6">
            <div className="h-1 w-12 bg-green-600 rounded-full"></div>
            <div className="h-1 w-4 bg-green-600 rounded-full opacity-50"></div>
            <div className="h-1 w-4 bg-green-600 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;