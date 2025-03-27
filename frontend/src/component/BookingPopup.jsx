import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';

const BookingPopup = ({ driver, service, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    location: '',
    notes: ''
  });
  const [existingBookings, setExistingBookings] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [timeSlotError, setTimeSlotError] = useState(null);

  
  const getServiceDuration = (serviceType) => {
    switch(serviceType) {
      case "Half Truck": return 2; 
      case "Full Truck": return 5; 
      case "More Than Truck": return 8; 
      default: return 2;
    }
  };

  
  useEffect(() => {
    const fetchExistingBookings = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `http://localhost:5555/booking/driver/${driver._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setExistingBookings(response.data);
      } catch (err) {
        console.error('Error fetching existing bookings:', err);
      }
    };

    fetchExistingBookings();
  }, [driver._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear time slot error when date or time changes
    if (name === 'date' || name === 'startTime') {
      setTimeSlotError(null);
    }
  };

  // Check if a time slot is available
  const checkTimeSlotAvailability = () => {
    if (!formData.date || !formData.startTime) return true;

    setIsCheckingAvailability(true);
    setTimeSlotError(null);

    try {
      // Create date objects for the requested booking
      const requestedStartTime = new Date(`${formData.date}T${formData.startTime}:00`);
      const serviceDuration = getServiceDuration(service);
      const requestedEndTime = new Date(requestedStartTime);
      requestedEndTime.setHours(requestedStartTime.getHours() + serviceDuration);

      // Check for conflicts with existing bookings
      for (const booking of existingBookings) {
        // Skip bookings that are cancelled or completed
        if (booking.status === 'cancelled' || booking.status === 'completed') {
          continue;
        }

        const existingStartTime = new Date(booking.startTime);
        const existingEndTime = new Date(booking.endTime);

        // Check for overlap
        if (
          (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
          (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
          (requestedStartTime <= existingStartTime && requestedEndTime >= existingEndTime)
        ) {
          const formattedStart = existingStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedEnd = existingEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedDate = existingStartTime.toLocaleDateString();
          
          setTimeSlotError(`This time conflicts with an existing booking on ${formattedDate} from ${formattedStart} to ${formattedEnd}`);
          setIsCheckingAvailability(false);
          return false;
        }
      }

      setIsCheckingAvailability(false);
      return true;
    } catch (err) {
      console.error('Error checking time slot availability:', err);
      setIsCheckingAvailability(false);
      return true; // Allow booking if check fails
    }
  };

  // Check availability when date or time changes
  useEffect(() => {
    if (formData.date && formData.startTime) {
      checkTimeSlotAvailability();
    }
  }, [formData.date, formData.startTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check time slot availability before proceeding
    if (!checkTimeSlotAvailability()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Get the token from sessionStorage
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to make a booking');
        setLoading(false);
        return;
      }

      // Format the date and time for API
      const combinedDateTime = `${formData.date}T${formData.startTime}:00.000Z`;

      const bookingData = {
        driverId: driver._id,
        service: service,
        date: formData.date,
        startTime: combinedDateTime,
        location: formData.location,
        notes: formData.notes
      };

      const response = await axios.post(
        'http://localhost:5555/booking/create', 
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onSuccess(response.data);
    } catch (err) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate min and max date for date picker (current date to 24 hours ahead)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const minDate = today.toISOString().split('T')[0];
  const maxDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Book {service}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-5">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-medium">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{driver.name}</h3>
              <p className="text-sm text-gray-500">{driver.vehicleType} • {service}</p>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-2" />
                  Date (within 24 hours)
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  min={minDate}
                  max={maxDate}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={16} className="inline mr-2" />
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {/* Time slot availability warning */}
              {timeSlotError && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                  <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Time slot unavailable</p>
                    <p>{timeSlotError}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} className="inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Enter pickup location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText size={16} className="inline mr-2" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Any special instructions or requirements"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Service details:</p>
                <div className="text-sm bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Service:</span> {service}</p>
                  <p><span className="font-medium">Price estimate:</span> {driver.price}</p>
                  <p><span className="font-medium">Duration:</span> {
                    service === 'Half Truck' ? '2 hours' : 
                    service === 'Full Truck' ? '5 hours' : '8 hours'
                  }</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isCheckingAvailability || timeSlotError}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;