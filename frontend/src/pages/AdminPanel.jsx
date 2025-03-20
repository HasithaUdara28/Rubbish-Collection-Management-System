import React, { useState } from 'react';
import { 
  UserIcon, 
  TruckIcon, 
  CalendarIcon, 
  ClipboardListIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  SearchIcon,
  RefreshCwIcon
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingDrivers, setPendingDrivers] = useState([
    { id: 'D1001', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', licenseNo: 'DL98765432', registeredDate: '2025-03-15' },
    { id: 'D1002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 987-6543', licenseNo: 'DL12345678', registeredDate: '2025-03-16' },
    { id: 'D1003', name: 'Michael Wong', email: 'michael@example.com', phone: '(555) 456-7890', licenseNo: 'DL45678901', registeredDate: '2025-03-18' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleApproveDriver = (driverId) => {
    setPendingDrivers(pendingDrivers.filter(driver => driver.id !== driverId));
    // In a real app, you would make an API call here
  };

  const handleRejectDriver = (driverId) => {
    setPendingDrivers(pendingDrivers.filter(driver => driver.id !== driverId));
    // In a real app, you would make an API call here
  };

  // Dashboard stats
  const stats = [
    { title: 'Total Drivers', value: '147', icon: <TruckIcon className="h-6 w-6 text-green-500" /> },
    { title: 'Active Drivers', value: '82', icon: <CheckCircleIcon className="h-6 w-6 text-green-500" /> },
    { title: 'Total Customers', value: '863', icon: <UserIcon className="h-6 w-6 text-green-500" /> },
    { title: 'Jobs This Month', value: '415', icon: <ClipboardListIcon className="h-6 w-6 text-green-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed h-full">
        <div className="flex items-center justify-center h-16 bg-green-600">
          <h1 className="text-white text-xl font-bold">EcoCollect Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4">
            <button 
              className={`flex items-center py-2 px-4 w-full text-left rounded-lg ${activeTab === 'dashboard' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <CalendarIcon className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button 
              className={`flex items-center py-2 px-4 w-full text-left mt-2 rounded-lg ${activeTab === 'drivers' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              onClick={() => setActiveTab('drivers')}
            >
              <TruckIcon className="h-5 w-5 mr-3" />
              Drivers
            </button>
            <button 
              className={`flex items-center py-2 px-4 w-full text-left mt-2 rounded-lg ${activeTab === 'customers' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              onClick={() => setActiveTab('customers')}
            >
              <UserIcon className="h-5 w-5 mr-3" />
              Customers
            </button>
            <button 
              className={`flex items-center py-2 px-4 w-full text-left mt-2 rounded-lg ${activeTab === 'jobs' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              onClick={() => setActiveTab('jobs')}
            >
              <ClipboardListIcon className="h-5 w-5 mr-3" />
              Jobs
            </button>
            <button 
              className={`flex items-center py-2 px-4 w-full text-left mt-2 rounded-lg ${activeTab === 'verifications' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              onClick={() => setActiveTab('verifications')}
            >
              <AlertCircleIcon className="h-5 w-5 mr-3" />
              Verifications
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {pendingDrivers.length}
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center">
                    <div className="mr-4">{stat.icon}</div>
                    <div>
                      <p className="text-gray-500 font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Jobs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { id: 'JOB1234', customer: 'Emily Johnson', service: 'Full Truck', date: '2025-03-18', status: 'Completed' },
                        { id: 'JOB1235', customer: 'Michael Brown', service: 'Half Truck', date: '2025-03-18', status: 'In Progress' },
                        { id: 'JOB1236', customer: 'Sarah Wilson', service: 'Full Truck', date: '2025-03-19', status: 'Scheduled' },
                      ].map((job, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{job.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{job.customer}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{job.service}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{job.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              job.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Driver Verifications Pending</h3>
                <ul className="divide-y divide-gray-200">
                  {pendingDrivers.map((driver) => (
                    <li key={driver.id} className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{driver.name}</h4>
                          <p className="text-sm text-gray-500">License: {driver.licenseNo}</p>
                          <p className="text-sm text-gray-500">Registered: {driver.registeredDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleApproveDriver(driver.id)}
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleRejectDriver(driver.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Verifications */}
        {activeTab === 'verifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Driver Verifications</h2>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <RefreshCwIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            <div className="text-sm text-gray-500">ID: {driver.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{driver.email}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.licenseNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.registeredDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveDriver(driver.id)}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectDriver(driver.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;