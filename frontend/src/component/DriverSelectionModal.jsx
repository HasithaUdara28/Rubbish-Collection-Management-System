import React, { useState } from 'react';
import axios from 'axios';
import { Check, X, User, Star } from 'lucide-react';

const DriverSelectionModal = ({ job, appliedDrivers, onClose, onDriverSelect }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDriverSelection = async () => {
    if (!selectedDriver) {
      setError('Please select a driver');
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:5555/jobs/${job._id}/select-driver`, 
        { driverId: selectedDriver._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Notify parent component of successful selection
      onDriverSelect(response.data.job);
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Driver selection error:', err);
      setError(err.response?.data?.message || 'Failed to select driver');
      setLoading(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Select a Driver</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drivers List */}
        <div className="p-6">
          {appliedDrivers.length === 0 ? (
            <div className="text-center text-gray-500">
              No drivers have applied to this job yet
            </div>
          ) : (
            <div className="space-y-4">
              {appliedDrivers.map((driver) => (
                <div 
                  key={driver._id} 
                  className={`border rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-all ${
                    selectedDriver?._id === driver._id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSelectedDriver(driver)}
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
                    <div className="mt-2 text-gray-600">
                      <p>{driver.email}</p>
                      <p>{driver.phone}</p>
                    </div>
                  </div>
                  {selectedDriver?._id === driver._id && (
                    <div className="text-green-500">
                      <Check size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleDriverSelection}
              disabled={!selectedDriver || loading}
              className={`px-4 py-2 rounded ${
                selectedDriver && !loading 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Selecting...' : 'Select Driver'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSelectionModal;