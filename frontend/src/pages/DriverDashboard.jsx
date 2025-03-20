import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TruckIcon, ToggleLeftIcon, ToggleRightIcon, CalendarIcon, ClipboardListIcon, CreditCardIcon, UserIcon, BellIcon, LogOut } from 'lucide-react';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();


  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      // If no token is found, redirect to login
      navigate("/");
    } else {
      try {
        // Decode the token to extract user details
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserDetails(decodedToken);
        
        // Fetch driver data to get current availability status
        fetch(`http://localhost:5555/drivers/drivers/${decodedToken.id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    setIsAvailable(data.availability);
  })
  .catch(error => {
    console.error("Error fetching driver details:", error);
  });
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/"); // Redirect to login on error
      }
    }
  }, [navigate]);
  
    
  // Sample data
  const upcomingJobs = [
    { id: 1, service: 'Full Truck', date: '2025-03-22', time: '10:00 AM', customer: 'Alex Johnson', address: '123 Main St, Anytown', status: 'Confirmed' },
    { id: 2, service: 'Half Truck', date: '2025-03-25', time: '02:30 PM', customer: 'Sarah Williams', address: '456 Oak Ave, Someville', status: 'Pending' }
  ];
  
  const availableJobs = [
    { id: 101, service: 'More Than Truck', date: '2025-03-30', time: 'Flexible', address: '789 Elm St, Othercity', details: 'Large furniture removal', estimatedPay: '$120-150' },
    { id: 102, service: 'Full Truck', date: '2025-04-05', time: 'Morning', address: '321 Pine Rd, Somewhere', details: 'Construction debris removal', estimatedPay: '$100-120' }
  ];

  const handleAvailabilityToggle = async () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability); // Optimistically update UI
  
    try {
      // Fix the endpoint to match your route definition
      const response = await fetch(`http://localhost:5555/drivers/drivers/${userDetails.id}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // Use 'availability' to match your model's property name
        body: JSON.stringify({ availability: newAvailability }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update availability");
      }
  
      const data = await response.json();
      console.log("Availability updated:", data);
    } catch (error) {
      console.error("Error updating availability:", error);
      setIsAvailable(!newAvailability); // Revert if failed
    }
  };

  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 bg-green-600">
          <h2 className="text-2xl font-bold text-white">EcoCollect</h2>
        </div>
        
        <div className="p-4">
        {userDetails ? (
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserIcon size={20} className="text-green-600" />
            </div>
            
            <div className="ml-3">
              <p className="font-medium">{userDetails.name}</p>
              <p className="text-sm text-gray-500">{userDetails.email}</p>
            </div>
          </div>
            ):( <p className="text-xl text-gray-600">Loading user details...</p>

            )
        }
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'dashboard' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <TruckIcon size={18} />
              </div>
              Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'schedule' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <CalendarIcon size={18} />
              </div>
              My Schedule
            </button>
            
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'jobs' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <ClipboardListIcon size={18} />
              </div>
              Available Jobs
            </button>
            
            <button 
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'earnings' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <CreditCardIcon size={18} />
              </div>
              Earnings
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-64">
          <button className="flex items-center text-gray-700 hover:text-red-600">
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Driver Dashboard</h1>
          <div className="flex items-center">
            <button className="relative p-2 text-gray-500 hover:text-green-600 mr-4">
              <BellIcon size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Your Availability Status</h3>
                    <p className="text-gray-500 mt-1">When available, customers can book you for immediate service</p>
                  </div>
                  <button 
                    onClick={handleAvailabilityToggle}
                    className={`flex items-center px-4 py-2 rounded-md text-white ${isAvailable ? 'bg-green-600' : 'bg-gray-500'}`}
                  >
                    {isAvailable ? (
                      <>
                        <ToggleRightIcon size={20} className="mr-2" />
                        Available
                      </>
                    ) : (
                      <>
                        <ToggleLeftIcon size={20} className="mr-2" />
                        Unavailable
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <h3 className="text-gray-500 text-sm font-medium">Today's Jobs</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">2</p>
                  <p className="mt-1 text-sm text-gray-600">Next pickup: 10:00 AM</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h3 className="text-gray-500 text-sm font-medium">Available Bids</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{availableJobs.length}</p>
                  <p className="mt-1 text-sm text-gray-600">Potential earnings: $220-270</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <h3 className="text-gray-500 text-sm font-medium">This Week's Earnings</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">$485</p>
                  <p className="mt-1 text-sm text-gray-600">6 completed jobs</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Upcoming Jobs</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{job.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{job.date}</div>
                            <div className="text-gray-500 text-sm">{job.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.customer}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.address}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-green-600 hover:text-green-900 mr-3">Start Navigation</button>
                            <button className="text-gray-600 hover:text-gray-900">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Available Job Bids</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{job.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{job.date}</div>
                            <div className="text-gray-500 text-sm">{job.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.address}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.details}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.estimatedPay}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Submit Bid</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {/* Other tab content would go here */}
          {activeTab === 'schedule' && <div><h2 className="text-xl font-semibold mb-4">My Schedule</h2></div>}
          {activeTab === 'jobs' && <div><h2 className="text-xl font-semibold mb-4">Available Jobs</h2></div>}
          {activeTab === 'earnings' && <div><h2 className="text-xl font-semibold mb-4">Earnings</h2></div>}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;