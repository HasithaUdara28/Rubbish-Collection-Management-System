import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, TruckIcon, StarIcon, MapPinIcon, PhoneIcon, UserIcon, FilterIcon, AlertCircleIcon, X, Clock, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';
import BookingPopup from '../component/BookingPopup';

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialService = location.state?.selectedService || 'Half Truck';
  const [selectedService, setSelectedService] = useState(initialService);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for booking popup
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([
    'Morning (8am-12pm)',
    'Afternoon (12pm-5pm)',
    'Evening (5pm-9pm)',
    'Any Time'
  ]);
  
  const services = [
    {
      id: 'Half Truck',
      name: 'Half Truck',
      description: 'Ideal for small cleanups, single items, or partial loads',
      capacity: 'Up to 50 cubic feet',
      idealFor: 'Single furniture items, small garden waste, partial garage cleanout',
      price: '$80'
    },
    {
      id: 'Full Truck',
      name: 'Full Truck',
      description: 'Perfect for medium-sized jobs and regular household cleanups',
      capacity: 'Up to 100 cubic feet',
      idealFor: 'Full room clearance, medium renovation waste, complete garage cleanout',
      price: '$150'
    },
    {
      id: 'More Than Truck',
      name: 'More Than Truck',
      description: 'Our largest option for big cleanups and commercial projects',
      capacity: 'Up to 200 cubic feet',
      idealFor: 'Moving waste, large renovation projects, commercial cleanouts',
      price: '$280'
    }
  ];

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all drivers from your backend
        const response = await axios.get('http://localhost:5555/drivers/drivers');
        
        // Filter drivers based on selected service and availability
        const filteredDrivers = response.data.filter(driver => 
          driver.verified && 
          driver.availability && 
          driver.services.includes(selectedService)
        );
        
        // Add some UI-friendly properties for the frontend
        const enhancedDrivers = filteredDrivers.map(driver => ({
          ...driver,
          rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mock rating between 4.0-5.0
          reviews: Math.floor(Math.random() * 200) + 20, // Mock reviews count
          price: `$${driver.services.includes('More Than Truck') ? '280' : 
                  driver.services.includes('Full Truck') ? '150' : '80'}`, // Price based on service
          experience: `${Math.floor(Math.random() * 8) + 1} years`, // Mock experience
          available: 'Now', // Mock availability time
          availableTimes: generateMockTimes() // Add mock available times
        }));
        
        setAvailableDrivers(enhancedDrivers);
        setFilteredDrivers(enhancedDrivers);
        
        // Extract all unique locations from drivers
        const allLocations = enhancedDrivers
          .flatMap(driver => driver.locations || [])
          .filter((location, index, self) => self.indexOf(location) === index)
          .sort();
        
        setAvailableLocations(['All Locations', ...allLocations]);
        setSelectedLocation('All Locations');
        setSelectedTime('Any Time');
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load available drivers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [selectedService]);

  // Generate mock available times for drivers
  const generateMockTimes = () => {
    const times = [];
    const timeSlots = ['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-9pm)'];
    
    // Randomly select 1-3 time slots
    const numSlots = Math.floor(Math.random() * 3) + 1;
    const selectedSlots = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, numSlots);
    
    return selectedSlots;
  };

  // Apply filters
  useEffect(() => {
    if (!availableDrivers.length) return;
    
    let filtered = [...availableDrivers];
    
    // Apply location filter
    if (selectedLocation && selectedLocation !== 'All Locations') {
      filtered = filtered.filter(driver => 
        driver.locations && driver.locations.includes(selectedLocation)
      );
    }
    
    // Apply time filter
    if (selectedTime && selectedTime !== 'Any Time') {
      filtered = filtered.filter(driver => 
        driver.availableTimes && driver.availableTimes.includes(selectedTime)
      );
    }
    
    setFilteredDrivers(filtered);
  }, [selectedLocation, selectedTime, availableDrivers]);

  // Handle booking button click
  const handleBookNow = (driver) => {
    // Check if user is logged in using sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Redirect to login page
      navigate('/', { 
        state: { 
          redirectAfterLogin: '/services',
          message: 'Please log in to book a driver' 
        } 
      });
      return;
    }
    
    setSelectedDriver(driver);
    setShowBookingPopup(true);
  };

  // Handle successful booking
  const handleBookingSuccess = (data) => {
    setBookingData(data);
    setBookingSuccess(true);
    setShowBookingPopup(false);
    
    // You could reset this after a few seconds to allow for more bookings
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingData(null);
    }, 5000);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedLocation('All Locations');
    setSelectedTime('Any Time');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Booking Success Message */}
      {bookingSuccess && (
        <div className="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 max-w-md">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p className="font-bold">Booking Successful!</p>
              <p className="text-sm">Your booking has been confirmed. Check your bookings for details.</p>
            </div>
            <button 
              onClick={() => setBookingSuccess(false)} 
              className="ml-auto text-green-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services Selection */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Select a Service</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <div 
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition duration-200 ${
                selectedService === service.id 
                  ? 'border-2 border-green-500 transform scale-105' 
                  : 'border border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                <div className={`p-2 rounded-full ${selectedService === service.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <TruckIcon size={24} className={selectedService === service.id ? 'text-green-600' : 'text-gray-400'} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Capacity:</span> {service.capacity}</p>
                <p><span className="font-medium">Ideal for:</span> {service.idealFor}</p>
                <p><span className="font-medium">Price :</span> {service.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Available Drivers Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Available Drivers for {selectedService}</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${filteredDrivers.length} drivers available`}
              </span>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 relative"
                onClick={toggleFilters}
              >
                <FilterIcon size={20} className="text-gray-500" />
                {(selectedLocation !== 'All Locations' || selectedTime !== 'Any Time') && (
                  <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
                )}
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Filter Drivers</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Reset All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Filter */}
                <div>
                  <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPinIcon size={16} className="inline mr-1" />
                    Location
                  </label>
                  <select 
                    id="location-filter"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    {availableLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                {/* Time Availability Filter */}
                <div>
                  <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={16} className="inline mr-1" />
                    Time Availability
                  </label>
                  <select 
                    id="time-filter"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    {availableTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-500">Finding available drivers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 px-4">
              <AlertCircleIcon size={40} className="text-red-500 mx-auto mb-4" />
              <p className="text-gray-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-lg">
              <UserIcon size={40} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">No drivers available with the selected filters</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or selecting a different service</p>
              <button 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDrivers.map((driver) => (
                <div key={driver._id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-medium">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{driver.name}</h3>
                        <div className="flex items-center">
                          <StarIcon size={16} className="text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{driver.rating} ({driver.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{driver.price}</div>
                      <div className="text-sm font-medium text-green-800 bg-green-100 px-2 py-1 rounded">
                        Available {driver.available}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center">
                      <MapPinIcon size={16} className="text-gray-400 mr-1 flex-shrink-0" />
                      <span className="truncate"> • {driver.locations.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {driver.experience}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon size={16} className="text-gray-400 mr-1" />
                      <span>{driver.phone || '(Contact via app)'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Vehicle:</span> {driver.vehicleType}
                    </div>
                    <div>
                      <span className="font-medium">Services:</span> {driver.services.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Available Times:</span> {driver.availableTimes.join(', ')}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
                      onClick={() => handleBookNow(driver)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer/>
      
      {/* Booking Popup */}
      {showBookingPopup && selectedDriver && (
        <BookingPopup 
          driver={selectedDriver}
          service={selectedService}
          onClose={() => setShowBookingPopup(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default ServicesPage;