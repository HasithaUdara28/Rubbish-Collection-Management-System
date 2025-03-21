import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, TruckIcon, StarIcon, MapPinIcon, PhoneIcon, UserIcon, FilterIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

const ServicesPage = () => {
  const location = useLocation();
  const initialService = location.state?.selectedService || 'Half Truck';
  const [selectedService, setSelectedService] = useState(initialService);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const services = [
    {
      id: 'Half Truck',
      name: 'Half Truck',
      description: 'Ideal for small cleanups, single items, or partial loads',
      capacity: 'Up to 50 cubic feet',
      idealFor: 'Single furniture items, small garden waste, partial garage cleanout',
      price: '$70-90'
    },
    {
      id: 'Full Truck',
      name: 'Full Truck',
      description: 'Perfect for medium-sized jobs and regular household cleanups',
      capacity: 'Up to 100 cubic feet',
      idealFor: 'Full room clearance, medium renovation waste, complete garage cleanout',
      price: '$110-130'
    },
    {
      id: 'More Than Truck',
      name: 'More Than Truck',
      description: 'Our largest option for big cleanups and commercial projects',
      capacity: 'Up to 200 cubic feet',
      idealFor: 'Moving waste, large renovation projects, commercial cleanouts',
      price: '$170-200'
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
          distance: `${(Math.random() * 5).toFixed(1)} miles`, // Mock distance
          price: `$${driver.services.includes('More Than Truck') ? '170-200' : 
                  driver.services.includes('Full Truck') ? '110-130' : '70-90'}`, // Price based on service
          experience: `${Math.floor(Math.random() * 8) + 1} years`, // Mock experience
          available: 'Now' // Mock availability time
        }));
        
        setAvailableDrivers(enhancedDrivers);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load available drivers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [selectedService]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
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
                <p><span className="font-medium">Price range:</span> {service.price}</p>
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
                {loading ? 'Loading...' : `${availableDrivers.length} drivers available`}
              </span>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <FilterIcon size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
          
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
          ) : availableDrivers.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-gray-300 rounded-lg">
              <UserIcon size={40} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">No drivers available for this service</p>
              <p className="text-gray-500 mt-2">Try selecting a different service or check back later</p>
              <button 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={() => {
                  // Here you could navigate to a "post a job" page
                  alert("This would navigate to the post a job page");
                }}
              >
                Post a Job Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDrivers.map((driver) => (
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
                      <span className="truncate">{driver.distance} • {driver.locations.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {driver.experience}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon size={16} className="text-gray-400 mr-1" />
                      <span>{driver.phone || '(Contact via app)'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Vehicle:</span> {driver.vehicleType}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Services:</span> {driver.services.join(', ')}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-md mr-3">
                      View Profile
                    </button>
                    <button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">
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
    </div>
  );
};

export default ServicesPage;