import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TruckIcon, MapPinIcon, ClipboardListIcon, DollarSignIcon, FileTextIcon } from 'lucide-react';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Check authentication on component mount
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
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/"); // Redirect to login on error
      }
    }
  }, [navigate]);

  // Predefined job type options
  const jobTypes = [
    { value: 'More Than Truck', label: 'More Than Truck - Large Moving' },
    { value: 'Full Truck', label: 'Full Truck - Complete Truck Rental' },
    { value: 'Small Move', label: 'Small Move - Compact Items' },
    { value: 'Furniture Delivery', label: 'Furniture Delivery' },
    { value: 'Office Relocation', label: 'Office Relocation' }
  ];

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Get token from session storage
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Authentication failed. Please log in again.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const payload = { 
        jobType, 
        pickupLocation,
        description,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
        userId: userDetails?.id // Add user ID from decoded token
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(
        'http://localhost:5555/jobs/create', 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Job posted successfully!');
      
      // Reset form
      setJobType('');
      setPickupLocation('');
      setDescription('');
      setEstimatedPrice('');
    } catch (err) {
      // Detailed error logging
      console.error('Full error object:', err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with error:', err.response.data);
        console.error('Status code:', err.response.status);
        
        setError(err.response.data.message || 'Failed to post job. Check server logs.');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Check network connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <ClipboardListIcon size={24} className="text-green-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">Post a New Job</h2>
      </div>

      <form onSubmit={handleSubmitJob} className="space-y-6">
        {/* Job Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Job Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setJobType(type.value)}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  jobType === type.value 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <TruckIcon className="mr-2" size={20} />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup address"
              required
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <FileTextIcon className="text-gray-400" size={20} />
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional details about your job (optional)"
              rows="4"
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>

        {/* Estimated Price */}
        <div>
          <label htmlFor="estimatedPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Price (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="text-gray-400" size={20} />
            </div>
            <input
              type="number"
              id="estimatedPrice"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              placeholder="Enter estimated budget"
              min="0"
              step="0.01"
              className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || !jobType || !pickupLocation}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${
              loading || !jobType || !pickupLocation
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            }`}
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;