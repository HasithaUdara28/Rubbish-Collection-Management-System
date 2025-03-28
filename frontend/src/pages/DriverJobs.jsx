import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, MapPin, DollarSign, Clock, CheckCircle, Check } from 'lucide-react';

const DriverJobs = () => {
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingJobId, setCompletingJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      // Fetch both accepted and completed jobs
      const responses = await Promise.all([
        axios.get('http://localhost:5555/jobs/driver/accepted-jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:5555/jobs/driver/completed-jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setAcceptedJobs(responses[0].data.acceptedJobs || []);
      setCompletedJobs(responses[1].data.completedJobs || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to retrieve jobs');
      } else if (err.request) {
        setError('No response received from server');
      } else {
        setError('Error setting up the request');
      }
      
      setLoading(false);
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      setCompletingJobId(jobId);
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setCompletingJobId(null);
        return;
      }

      const response = await axios.put(`http://localhost:5555/jobs/${jobId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Find the completed job
      const completedJob = acceptedJobs.find(job => job._id === jobId);
      
      // Update states
      setAcceptedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      setCompletedJobs(prevJobs => [{ ...completedJob, status: 'completed' }, ...prevJobs]);
      
      setCompletingJobId(null);
    } catch (err) {
      console.error('Error completing job:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to complete job');
      } else if (err.request) {
        setError('No response received from server');
      } else {
        setError('Error setting up the request');
      }
      
      setCompletingJobId(null);
    }
  };

  const renderJobCard = (job, isCompleted = false) => (
    <div 
      key={job._id} 
      className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Truck className="text-blue-500" />
          <h3 className="font-semibold text-lg">{job.jobType}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${
          isCompleted ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
        }`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="text-gray-500" size={20} />
          <span>{job.pickupLocation}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <DollarSign className="text-green-500" size={20} />
          <span className="font-bold">${job.estimatedPrice.toFixed(2)}</span>
        </div>
        
        {job.description && (
          <div className="text-gray-600 italic">
            "{job.description}"
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Clock className="text-gray-500" size={20} />
          <span>
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {!isCompleted && (
          <button
            onClick={() => handleCompleteJob(job._id)}
            disabled={completingJobId === job._id}
            className={`mt-4 w-full flex items-center justify-center py-2 px-4 rounded-md 
              ${completingJobId === job._id 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {completingJobId === job._id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <CheckCircle className="mr-2" size={20} />
                Mark as Completed
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Jobs</h2>
      
      {/* Accepted Jobs Section */}
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold">Active Jobs</h3>
          <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {acceptedJobs.length}
          </span>
        </div>
        
        {acceptedJobs.length === 0 ? (
          <div className="text-center text-gray-500 p-4 border rounded-lg">
            No active jobs at the moment
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedJobs.map(job => renderJobCard(job))}
          </div>
        )}
      </div>
      
      {/* Completed Jobs Section */}
      <div>
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold">Completed Jobs</h3>
          <span className="ml-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {completedJobs.length}
          </span>
        </div>
        
        {completedJobs.length === 0 ? (
          <div className="text-center text-gray-500 p-4 border rounded-lg">
            No completed jobs yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedJobs.map(job => renderJobCard(job, true))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverJobs;