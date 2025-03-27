import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { CalendarIcon, TruckIcon, ClipboardListIcon, CreditCardIcon, UserIcon, BellIcon, LogOut } from 'lucide-react';
import PostJobPage from "./PostJobPage";
import JobsPage from "./JobsPage";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [jobPosts, setJobPosts] = useState([
    { id: 101, service: 'More Than Truck', date: '2025-03-30', time: 'Flexible', location: '123 Main St', bids: 4 },
    { id: 102, service: 'Full Truck', date: '2025-04-05', time: 'Morning', location: '456 Park Ave', bids: 2 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Fetch bookings after setting user details
        fetchBookings(token);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/"); // Redirect to login on error
      }
    }
  }, [navigate]);

  const fetchBookings = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5555/booking/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Sort bookings with confirmed and pending statuses first
      const sortedBookings = response.data.sort((a, b) => {
        const statusOrder = { 'confirmed': 1, 'pending': 2, 'cancelled': 3 };
        return statusOrder[a.status.toLowerCase()] - statusOrder[b.status.toLowerCase()];
      });

      setUpcomingBookings(sortedBookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to retrieve bookings");
      setLoading(false);
    }
  };

  const handlePayBooking = (bookingId) => {
    const booking = upcomingBookings.find(b => b._id === bookingId);
    if (booking && booking.status === 'confirmed') {
      console.log(`Initiating payment for booking ${bookingId}`);
      // Add payment logic here
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`http://localhost:5555/booking/${bookingId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh bookings after cancellation
      fetchBookings(token);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      // Optionally show error message to user
    }
  };

  const handleLogout = () => {
    // Clear token and redirect to login
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => fetchBookings(sessionStorage.getItem("token"))}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 bg-green-600">
          <h2 className="text-2xl font-bold text-white">EcoCollect</h2>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserIcon size={20} className="text-green-600" />
            </div>
            {userDetails ? (
            <div className="ml-3">
              <p className="font-medium">{userDetails.name}</p>
              <p className="text-sm text-gray-500">{userDetails.role}</p>
            </div>
            ) : (
              <p className="text-xl text-gray-600">Loading user details...</p>
            )}
          </div>
          
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
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'bookings' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <CalendarIcon size={18} />
              </div>
              My Jobs
            </button>
            
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'posts' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <ClipboardListIcon size={18} />
              </div>
              Job Posts
            </button>
            
            <button 
              onClick={() => setActiveTab('payments')}
              className={`flex items-center w-full px-3 py-2 rounded-md ${
                activeTab === 'payments' ? 'bg-green-100 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">
                <CreditCardIcon size={18} />
              </div>
              Payment History
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-64">
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-red-600"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Customer Dashboard</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <h3 className="text-gray-500 text-sm font-medium">Next Pickup</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {upcomingBookings.length > 0 
                      ? new Date(upcomingBookings[0].date).toLocaleDateString() 
                      : 'No upcoming pickup'}
                  </p>
                  {upcomingBookings.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(upcomingBookings[0].startTime).toLocaleTimeString()} - {upcomingBookings[0].service}
                    </p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{upcomingBookings.length}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Confirmed: {upcomingBookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <h3 className="text-gray-500 text-sm font-medium">Completed Pickups</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {upcomingBookings.filter(b => b.status === 'completed').length}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Last 6 months</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Upcoming Pickups</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{booking.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-sm">{new Date(booking.startTime).toLocaleTimeString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.location}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                            <button className="text-green-600 hover:text-green-900">View Details</button>
                            <button 
                              className={`text-blue-600 ${
                                booking.status === 'confirmed' 
                                  ? 'hover:text-blue-900 cursor-pointer' 
                                  : 'text-opacity-50 cursor-not-allowed'
                              }`}
                              onClick={() => handlePayBooking(booking._id)}
                              disabled={booking.status !== 'confirmed'}
                            >
                              Pay
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={['confirmed', 'pending'].includes(booking.status)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Your Active Job Posts</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobPosts.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{job.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{job.date}</div>
                            <div className="text-gray-500 text-sm">{job.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{job.location}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {job.bids} bids
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">View Bids</button>
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {/* Other tab content */}
          {activeTab === 'bookings' && <JobsPage />}
          {activeTab === 'posts' && <PostJobPage />}
          {activeTab === 'payments' && <div><h2 className="text-xl font-semibold mb-4">Payment History</h2></div>}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;