import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Star, Phone, Mail, CreditCard } from 'lucide-react';
import DriverSelectionModal from './DriverSelectionModal';
import PaymentModal from './PaymentModal'; // You'll need to create this component

const AppliedDriversModal = ({ job, onClose }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedDrivers, setAppliedDrivers] = useState([]);
  const [showDriverSelection, setShowDriverSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    const fetchAppliedDrivers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5555/jobs/${job._id}/applied-drivers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setSelectedJob(job);
        setAppliedDrivers(response.data.driversApplied || []); // Add fallback to empty array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applied drivers:', err);
        setError(err.response?.data?.message || 'Failed to retrieve applied drivers');
        setLoading(false);
      }
    };

    if (job && job._id) {
      fetchAppliedDrivers();
    }
  }, [job]);

  const handleDriverSelection = (updatedJob) => {
    // Update the job status locally
    setSelectedJob({
      ...selectedJob,
      status: 'accepted',
      driverId: selectedDriver ? selectedDriver._id : null
    });
    
    setShowDriverSelection(false);
    // Notify parent component of the change
    onClose(true); // Pass true to indicate the job was updated
  };

  const renderStarRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={`inline-block ${
          index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'
        }`}
        fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
  };

  const handleSelectDriver = (driver) => {
    // Only allow selection when job is in "posted" status
    if (job.status === 'posted' || job.status === 'bidding') {
      setSelectedDriver(driver);
      setShowDriverSelection(true);
    }
  };

  const handlePayJob = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    onClose(true); // Refresh job list on payment completion
  };

  // Check if job is in a state where driver selection is disabled
  const isDriverSelectionDisabled = job.status === 'accepted' || job.status === 'completed' || job.status === 'cancelled';
  
  // Check if we can show the payment button (only when status is "accepted")
  const showPaymentButton = job.status === 'accepted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Job Details and Applied Drivers</h2>
          <button 
            onClick={() => onClose(false)} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Job Details Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Job Type</p>
              <p className="font-medium">{job.jobType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pickup Location</p>
              <p className="font-medium">{job.pickupLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Price</p>
              <p className="font-medium">${job.estimatedPrice?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                job.status === 'posted' ? 'bg-yellow-100 text-yellow-800' : 
                job.status === 'bidding' ? 'bg-purple-100 text-purple-800' :
                job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          </div>
          {job.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-800">{job.description}</p>
            </div>
          )}
        </div>

        {/* Applied Drivers Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Applied Drivers ({appliedDrivers.length})
            </h3>
            {showPaymentButton && (
              <button 
                onClick={handlePayJob}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <CreditCard size={16} className="mr-2" />
                Pay for Job
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading applied drivers...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              {error}
            </div>
          ) : appliedDrivers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No drivers have applied to this job yet
            </div>
          ) : (
            <div className="space-y-4">
              {appliedDrivers.map((driver) => (
                <div 
                  key={driver._id} 
                  className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <User size={40} className="text-gray-500 bg-gray-100 rounded-full p-2" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800">{driver.name}</h4>
                      <div className="flex items-center">
                        {renderStarRating(driver.rating || 0)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({driver.rating?.toFixed(1) || 'N/A'})
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-3 text-gray-600">
                      {driver.email && (
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2" />
                          <span>{driver.email}</span>
                        </div>
                      )}
                      {driver.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2" />
                          <span>{driver.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <button 
                        onClick={() => handleSelectDriver(driver)}
                        disabled={isDriverSelectionDisabled}
                        className={`${
                          isDriverSelectionDisabled
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                      >
                        Select Driver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Driver Selection Modal */}
        {showDriverSelection && (
          <DriverSelectionModal 
            job={selectedJob}
            appliedDrivers={appliedDrivers}
            onClose={() => setShowDriverSelection(false)}
            onDriverSelect={handleDriverSelection}
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal 
            job={selectedJob}
            onClose={() => setShowPaymentModal(false)}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default AppliedDriversModal;