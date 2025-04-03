import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TruckIcon, ToggleLeftIcon, ToggleRightIcon, CalendarIcon, ClipboardListIcon, CreditCardIcon, UserIcon, BellIcon, LogOut } from 'lucide-react';
import AvailableJobsPage from "./AvailableJobsPage";
import DriverJobs from "./DriverJobs";

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]); // New state for cancelled bookings
  const navigate = useNavigate();

  
  const fetchDriverBookings = () => {
    const token = sessionStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
  
    fetch(`http://localhost:5555/booking/driver/${decodedToken.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(bookings => {
      const now = new Date();
      
      // Filter upcoming bookings (pending or confirmed)
      const upcoming = bookings.filter(job => 
        new Date(job.startTime) > now && 
        (job.status === 'pending' || job.status === 'confirmed')
      );
  
      // Filter completed bookings
      const completed = bookings.filter(job => 
        job.status === 'completed'
      );
  
      // Filter cancelled bookings
      const cancelled = bookings.filter(job => 
        job.status === 'cancelled' || job.status === 'rejected'
      );
  
      // Process upcoming jobs
      setUpcomingJobs(upcoming.map(job => ({
        id: job._id,
        service: job.service,
        date: new Date(job.date).toISOString().split('T')[0],
        time: new Date(job.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        customer: job.customerId || 'Customer',
        address: job.location,
        status: job.status === 'pending' ? 'Pending' : 'Confirmed'
      })));
      
      // Process completed jobs
      setCompletedBookings(completed.map(job => ({
        id: job._id,
        service: job.service,
        date: new Date(job.date).toISOString().split('T')[0],
        time: new Date(job.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        customer: job.customerName || 'Customer',
        address: job.location,
        totalPrice: job.totalPrice || 0
      })));

      // Process cancelled jobs
      setCancelledBookings(cancelled.map(job => ({
        id: job._id,
        service: job.service,
        date: new Date(job.date).toISOString().split('T')[0],
        time: new Date(job.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        customer: job.customerName || 'Customer',
        address: job.location,
        reason: job.cancellationReason || (job.status === 'rejected' ? 'Driver rejected' : 'Cancelled'),
        status: job.status
      })));
    })
    .catch(error => {
      console.error("Error fetching driver bookings:", error);
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      navigate("/");
    } else {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserDetails(decodedToken);
        
        // Fetch driver availability
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

        // Fetch driver bookings
        fetchDriverBookings();

      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/");
      }
    }
  }, [navigate]);

  // Booking action handlers
  const handleBookingConfirm = (bookingId) => {
    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:5555/booking/${bookingId}/confirm`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }
      return response.json();
    })
    .then(() => {
      // Refresh bookings after confirmation
      fetchDriverBookings();
    })
    .catch(error => {
      console.error('Booking confirmation error:', error);
      alert('Could not confirm booking. Please try again.');
    });
  };

  const handleBookingReject = (bookingId) => {
    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:5555/booking/${bookingId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }
      return response.json();
    })
    .then(() => {
      // Refresh bookings after rejection
      fetchDriverBookings();
    })
    .catch(error => {
      console.error('Booking rejection error:', error);
      alert('Could not reject booking. Please try again.');
    });
  };
  
  // New handler to mark booking as completed
  const handleBookingComplete = (bookingId) => {
    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:5555/booking/${bookingId}/complete`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to mark booking as completed');
      }
      return response.json();
    })
    .then(() => {
      // Refresh bookings after marking as completed
      fetchDriverBookings();
    })
    .catch(error => {
      console.error('Booking completion error:', error);
      alert('Could not mark booking as completed. Please try again.');
    });
  };
 

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
        <h2 className="text-lg font-medium text-gray-800">Jobs</h2>
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
                    job.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {job.status === 'Pending' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleBookingConfirm(job.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleBookingReject(job.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {job.status === 'Confirmed' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleBookingComplete(job.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Complete
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Start Navigation
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Details
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
              
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Completed Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{booking.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{booking.date}</div>
                            <div className="text-gray-500 text-sm">{booking.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.customer}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.address}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">${booking.totalPrice}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {completedBookings.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No completed bookings to display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cancelled Bookings Section */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Cancelled Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cancelledBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{booking.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{booking.date}</div>
                            <div className="text-gray-500 text-sm">{booking.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.customer}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.address}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'rejected' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status === 'rejected' ? 'Rejected' : 'Cancelled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.reason}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {cancelledBookings.length === 0 && (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                            No cancelled bookings to display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {/* Other tab content would go here */}
          {activeTab === 'schedule' && <DriverJobs />}
          {activeTab === 'jobs' && <AvailableJobsPage />}
          {activeTab === 'earnings' && <div><h2 className="text-xl font-semibold mb-4">Earnings</h2></div>}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;