import React, { useState, useEffect } from 'react';
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
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [isDriversLoading, setIsDriversLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customersError, setCustomersError] = useState(null);
  const [driversError, setDriversError] = useState(null);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  
  const fetchCustomers = async () => {
    setIsCustomersLoading(true);
    setCustomersError(null);
    try {
      const response = await fetch('http://localhost:5555/user/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setCustomersError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setIsCustomersLoading(false);
    }
  };

  
  const fetchDrivers = async () => {
    setIsDriversLoading(true);
    setDriversError(null);
    try {
      const response = await fetch('http://localhost:5555/drivers/drivers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch drivers');
      }

      const data = await response.json();
      
      
      const verifiedDrivers = data.filter(driver => driver.verified);
      setDrivers(verifiedDrivers);
      
      
      const unverifiedDrivers = data.filter(driver => !driver.verified).map(driver => ({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone || 'Not provided',
        licenseNo: driver.licenceNumber,
        registeredDate: new Date(driver.createdAt).toISOString().split('T')[0] || 'Unknown',
        vehicleType: driver.vehicleType
      }));
      
      setPendingDrivers(unverifiedDrivers);
    } catch (err) {
      setDriversError(err.message);
      console.error('Error fetching drivers:', err);
    } finally {
      setIsDriversLoading(false);
    }
  };

  
  const fetchPendingDrivers = async () => {
    setIsVerificationLoading(true);
    setVerificationError(null);
    try {
     
      const response = await fetch('http://localhost:5555/drivers/drivers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch driver verifications');
      }

      const data = await response.json();
      
      
      const unverifiedDrivers = data.filter(driver => !driver.verified).map(driver => ({
        id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone || 'Not provided',
        licenseNo: driver.licenceNumber, 
        registeredDate: new Date(driver.createdAt).toISOString().split('T')[0] || 'Unknown',
        vehicleType: driver.vehicleType
      }));
      
      setPendingDrivers(unverifiedDrivers);
    } catch (err) {
      setVerificationError(err.message);
      console.error('Error fetching driver verifications:', err);
    } finally {
      setIsVerificationLoading(false);
    }
  };

  
  const handleApproveDriver = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:5555/drivers/drivers/${driverId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve driver');
      }

      
      setPendingDrivers(pendingDrivers.filter(driver => driver.id !== driverId));
      
      
      fetchDrivers();
      
    } catch (err) {
      setVerificationError(err.message);
      console.error('Error approving driver:', err);
    }
  };

  
  const handleRejectDriver = async (driverId) => {
    
    setPendingDrivers(pendingDrivers.filter(driver => driver.id !== driverId));
    
  };

  
  const fetchRecentJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5555/jobs/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recent jobs');
      }

      const data = await response.json();
      setRecentJobs(data.jobs);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recent jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchRecentJobs();
      fetchPendingDrivers();
    } else if (activeTab === 'drivers') {
      fetchDrivers();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'verifications') {
      fetchPendingDrivers();
    }
  }, [activeTab]);

  
  const handleRefreshData = () => {
    if (activeTab === 'dashboard') {
      fetchRecentJobs();
      fetchPendingDrivers();
    } else if (activeTab === 'drivers') {
      fetchDrivers();
    } else if (activeTab === 'customers') {
      fetchCustomers();
    } else if (activeTab === 'verifications') {
      fetchPendingDrivers();
    }
  };

 
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  
  const getCustomerName = (job) => {
    if (job.customerId && typeof job.customerId === 'object') {
      return job.customerId.name || 'Unknown';
    }
    return 'Unknown Customer';
  };

  
  const truncateId = (id) => {
    if (typeof id === 'string') {
      return id.substring(0, 8) + '...';
    } else if (id && id.toString) {
      return id.toString().substring(0, 8) + '...';
    }
    return 'Unknown';
  };

  
  const filteredDrivers = drivers.filter(driver => 
    driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (driver.licenceNumber && driver.licenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone && customer.phone?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  
  const filteredPendingDrivers = pendingDrivers.filter(driver => 
    driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    
    sessionStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      
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

      
      <div className="ml-64 flex-1 p-8">
        
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center">
                  <div className="mr-4"><TruckIcon className="h-6 w-6 text-green-500" /></div>
                  <div>
                    <p className="text-gray-500 font-medium">Total Drivers</p>
                    <p className="text-2xl font-bold text-gray-800">{drivers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center">
                  <div className="mr-4"><CheckCircleIcon className="h-6 w-6 text-green-500" /></div>
                  <div>
                    <p className="text-gray-500 font-medium">Active Drivers</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {drivers.filter(driver => driver.availability === true).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center">
                  <div className="mr-4"><UserIcon className="h-6 w-6 text-green-500" /></div>
                  <div>
                    <p className="text-gray-500 font-medium">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center">
                  <div className="mr-4"><ClipboardListIcon className="h-6 w-6 text-green-500" /></div>
                  <div>
                    <p className="text-gray-500 font-medium">Jobs This Month</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {recentJobs.filter(job => {
                        const jobDate = new Date(job.createdAt);
                        const now = new Date();
                        return jobDate.getMonth() === now.getMonth() &&
                               jobDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Recent Jobs</h3>
                  <button 
                    onClick={fetchRecentJobs}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md mb-3">
                    {error}
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            Loading jobs...
                          </td>
                        </tr>
                      ) : recentJobs.length > 0 ? (
                        recentJobs.map((job) => (
                          <tr key={job._id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {truncateId(job._id)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {getCustomerName(job)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {job.jobType}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(job.createdAt)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                job.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                job.status === 'posted' ? 'bg-yellow-100 text-yellow-800' :
                                job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            No recent jobs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Driver Verifications Pending</h3>
                  <button 
                    onClick={handleRefreshData}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isVerificationLoading}
                  >
                    <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isVerificationLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                {verificationError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md mb-3">
                    {verificationError}
                  </div>
                )}
                
                {isVerificationLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading pending verifications...
                  </div>
                ) : pendingDrivers.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {pendingDrivers.slice(0, 3).map((driver) => (
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
                    {pendingDrivers.length > 3 && (
                      <li className="py-2">
                        <button 
                          onClick={() => setActiveTab('verifications')}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          View all {pendingDrivers.length} pending verifications
                        </button>
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No pending verifications
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'drivers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Verified Drivers</h2>
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
                <button 
                  className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => fetchDrivers()}
                  disabled={isDriversLoading}
                >
                  <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isDriversLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {driversError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                {driversError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isDriversLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading drivers...
                </div>
              ) : filteredDrivers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <TruckIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">ID: {truncateId(driver._id)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.email}</div>
                          <div className="text-sm text-gray-500">{driver.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.licenceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.vehicleType || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driver.availability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {driver.availability ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No drivers match your search' : 'No verified drivers found'}
                </div>
              )}
            </div>
          </div>
        )}

        
        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button 
                  className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => fetchCustomers()}
                  disabled={isCustomersLoading}
                >
                  <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isCustomersLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {customersError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                {customersError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isCustomersLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading customers...
                </div>
              ) : filteredCustomers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">ID: {truncateId(customer._id)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.phone || 'Not provided'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {Math.floor(Math.random() * 10)} jobs
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No customers match your search' : 'No customers found'}
                </div>
              )}
            </div>
          </div>
        )}

        
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
                <button 
                  className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={handleRefreshData}
                  disabled={isVerificationLoading}
                >
                  <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isVerificationLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {verificationError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                {verificationError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isVerificationLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading driver verifications...
                </div>
              ) : filteredPendingDrivers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPendingDrivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">ID: {truncateId(driver.id)}</div>
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
                          {driver.vehicleType || 'Not specified'}
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No drivers match your search' : 'No pending driver verifications'}
                </div>
              )}
            </div>
          </div>
        )}

        
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">All Jobs</h2>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button 
                  className="ml-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => fetchRecentJobs()}
                  disabled={isLoading}
                >
                  <RefreshCwIcon className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading jobs...
                </div>
              ) : recentJobs.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentJobs.map((job) => (
                      <tr key={job._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {truncateId(job._id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCustomerName(job)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.jobType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(job.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'posted' ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.driverId ? (
                            typeof job.driverId === 'object' ? job.driverId.name : truncateId(job.driverId)
                          ) : 'Not assigned'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No jobs match your search' : 'No jobs found'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;