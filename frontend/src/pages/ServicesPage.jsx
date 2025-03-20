import React, { useState } from 'react';
import { ArrowLeftIcon, TruckIcon, StarIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState('half-truck');
  
  // Sample data for available drivers
  const availableDrivers = {
    'half-truck': [
      { id: 1, name: 'John Smith', rating: 4.8, reviews: 124, distance: '1.2 miles', price: '$75', experience: '3 years', phone: '555-123-4567', available: 'Now' },
      { id: 2, name: 'Maria Garcia', rating: 4.9, reviews: 98, distance: '2.5 miles', price: '$80', experience: '5 years', phone: '555-234-5678', available: 'In 30 min' },
      { id: 3, name: 'David Chen', rating: 4.7, reviews: 56, distance: '3.1 miles', price: '$70', experience: '2 years', phone: '555-345-6789', available: 'Now' }
    ],
    'full-truck': [
      { id: 4, name: 'James Wilson', rating: 4.9, reviews: 211, distance: '1.8 miles', price: '$120', experience: '7 years', phone: '555-456-7890', available: 'Now' },
      { id: 5, name: 'Linda Johnson', rating: 4.6, reviews: 87, distance: '4.2 miles', price: '$115', experience: '4 years', phone: '555-567-8901', available: 'In 45 min' }
    ],
    'more-than-truck': [
      { id: 6, name: 'Robert Brown', rating: 5.0, reviews: 176, distance: '2.2 miles', price: '$180', experience: '8 years', phone: '555-678-9012', available: 'Now' },
      { id: 7, name: 'Sarah Lee', rating: 4.8, reviews: 92, distance: '3.7 miles', price: '$175', experience: '6 years', phone: '555-789-0123', available: 'In 60 min' }
    ]
  };

  const services = [
    {
      id: 'half-truck',
      name: 'Half Truck',
      description: 'Ideal for small cleanups, single items, or partial loads',
      capacity: 'Up to 50 cubic feet',
      idealFor: 'Single furniture items, small garden waste, partial garage cleanout',
      price: '$70-90'
    },
    {
      id: 'full-truck',
      name: 'Full Truck',
      description: 'Perfect for medium-sized jobs and regular household cleanups',
      capacity: 'Up to 100 cubic feet',
      idealFor: 'Full room clearance, medium renovation waste, complete garage cleanout',
      price: '$110-130'
    },
    {
      id: 'more-than-truck',
      name: 'More Than Truck',
      description: 'Our largest option for big cleanups and commercial projects',
      capacity: 'Up to 200 cubic feet',
      idealFor: 'Moving waste, large renovation projects, commercial cleanouts',
      price: '$170-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Drivers for {services.find(s => s.id === selectedService)?.name}</h2>
          
          {availableDrivers[selectedService].length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No drivers available at the moment. Try another service or post a job.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableDrivers[selectedService].map((driver) => (
                <div key={driver.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition duration-200">
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
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPinIcon size={16} className="text-gray-400 mr-1" />
                      <span>{driver.distance}</span>
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {driver.experience}
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon size={16} className="text-gray-400 mr-1" />
                      <span>{driver.phone}</span>
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