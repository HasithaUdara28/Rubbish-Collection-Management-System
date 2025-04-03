import React, { useState, useEffect } from 'react';
import { TruckIcon, MapPinIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import axios from 'axios';

const AvailableJobsPage = () => {
  const [availableJobs, setAvailableJobs] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    jobType: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    const fetchAvailableJobs = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:5555/jobs/', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: filters // Send filters to backend
        });

        // Ensure availableJobs is always an array
        setAvailableJobs(response.data.jobs || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching available jobs:", err);
        setError(err.message || 'Failed to retrieve available jobs');
        setLoading(false);
      }
    };

    fetchAvailableJobs();
  }, [filters]);

  const handleBidSubmit = async (jobId) => {
    try {
      const token = sessionStorage.getItem("token");

      await axios.post(`http://localhost:5555/jobs/${jobId}/bid`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Bid submitted successfully!');
    } catch (err) {
      console.error("Error submitting bid:", err);
      alert('Failed to submit bid. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Job Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            name="jobType" 
            value={filters.jobType} 
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Job Types</option>
            <option value="More Than Truck">More Than Truck</option>
            <option value="Full Truck">Full Truck</option>
            <option value="Delivery">Delivery</option>
          </select>
          
          <input 
            type="number" 
            name="minPrice" 
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            className="px-3 py-2 border rounded-md"
          />
          
          <input 
            type="number" 
            name="maxPrice" 
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            className="px-3 py-2 border rounded-md"
          />
          
          <input 
            type="text" 
            name="location" 
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <TruckIcon size={24} className="mr-3 text-green-600" />
          <h2 className="text-lg font-medium text-gray-800">Available Jobs</h2>
        </div>
        
        {availableJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No available jobs at the moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900 flex items-center">
                        <TruckIcon size={16} className="inline-block mr-2 text-green-600" />
                        {job.jobType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-900">
                        <MapPinIcon size={16} className="inline-block mr-2 text-red-500" />
                        {job.pickupLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-900">
                        <CalendarIcon size={16} className="inline-block mr-2 text-blue-500" />
                        {new Date(job.pickupTime).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-900">
                        <DollarSignIcon size={16} className="inline-block mr-2 text-green-500" />
                        ${job.estimatedPrice ? job.estimatedPrice.toFixed(2) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {/* View Job Details */}}
                      >
                        View Details
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleBidSubmit(job._id)}
                      >
                        Apply for Job
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableJobsPage;
