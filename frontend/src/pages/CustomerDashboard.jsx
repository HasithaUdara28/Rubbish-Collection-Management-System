import React, { useState } from 'react';
import { CalendarIcon, TruckIcon, ClipboardListIcon, CreditCardIcon, UserIcon, BellIcon, LogOut } from 'lucide-react';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample data
  const upcomingBookings = [
    { id: 1, service: 'Full Truck', date: '2025-03-22', time: '10:00 AM', driver: 'John Smith', status: 'Confirmed' },
    { id: 2, service: 'Half Truck', date: '2025-04-01', time: '02:30 PM', driver: 'Mike Johnson', status: 'Pending' }
  ];
  
  const jobPosts = [
    { id: 101, service: 'More Than Truck', date: '2025-03-30', time: 'Flexible', location: '123 Main St', bids: 4 },
    { id: 102, service: 'Full Truck', date: '2025-04-05', time: 'Morning', location: '456 Park Ave', bids: 2 }
  ];

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
            <div className="ml-3">
              <p className="font-medium">Alex Johnson</p>
              <p className="text-sm text-gray-500">Customer</p>
            </div>
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
              My Bookings
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
          <button className="flex items-center text-gray-700 hover:text-red-600">
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
                    {upcomingBookings.length > 0 ? upcomingBookings[0].date : 'No upcoming pickup'}
                  </p>
                  {upcomingBookings.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">{upcomingBookings[0].time} - {upcomingBookings[0].service}</p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h3 className="text-gray-500 text-sm font-medium">Active Job Posts</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{jobPosts.length}</p>
                  <p className="mt-1 text-sm text-gray-600">Total bids received: {jobPosts.reduce((sum, job) => sum + job.bids, 0)}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <h3 className="text-gray-500 text-sm font-medium">Completed Pickups</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">24</p>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-gray-900">{booking.service}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{booking.date}</div>
                            <div className="text-gray-500 text-sm">{booking.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{booking.driver}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-green-600 hover:text-green-900 mr-3">View Details</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
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
          
          {/* Other tab content would go here */}
          {activeTab === 'bookings' && <div><h2 className="text-xl font-semibold mb-4">My Bookings</h2></div>}
          {activeTab === 'posts' && <div><h2 className="text-xl font-semibold mb-4">Job Posts</h2></div>}
          {activeTab === 'payments' && <div><h2 className="text-xl font-semibold mb-4">Payment History</h2></div>}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;