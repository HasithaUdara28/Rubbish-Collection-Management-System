import React, { useState } from 'react';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, TruckIcon, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    service: 'full-truck',
    date: '',
    time: '',
    address: '',
    description: '',
    photos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would submit the form data to your backend
    console.log('Form submitted:', formData);
    // Redirect to a confirmation page or show a success message
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="text-green-600 hover:text-green-800">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Post a Job</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Create your job post</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.service === 'half-truck' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, service: 'half-truck' }))}
                  >
                    <div className="flex flex-col items-center">
                      <TruckIcon size={24} className={formData.service === 'half-truck' ? 'text-green-600' : 'text-gray-400'} />
                      <span className={`mt-2 font-medium ${formData.service === 'half-truck' ? 'text-green-600' : 'text-gray-600'}`}>Half Truck</span>
                      <span className="text-xs text-gray-500 mt-1">$70-90</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.service === 'full-truck' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, service: 'full-truck' }))}
                  >
                    <div className="flex flex-col items-center">
                      <TruckIcon size={24} className={formData.service === 'full-truck' ? 'text-green-600' : 'text-gray-400'} />
                      <span className={`mt-2 font-medium ${formData.service === 'full-truck' ? 'text-green-600' : 'text-gray-600'}`}>Full Truck</span>
                      <span className="text-xs text-gray-500 mt-1">$110-130</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      formData.service === 'more-than-truck' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, service: 'more-than-truck' }))}
                  >
                    <div className="flex flex-col items-center">
                      <TruckIcon size={24} className={formData.service === 'more-than-truck' ? 'text-green-600' : 'text-gray-400'} />
                      <span className={`mt-2 font-medium ${formData.service === 'more-than-truck' ? 'text-green-600' : 'text-gray-600'}`}>More Than Truck</span>
                      <span className="text-xs text-gray-500 mt-1">$170-200</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="block w-full pl-10 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="block w-full pl-10 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Flexible (Any time)</option>
                      <option value="morning">Morning (8am - 12pm)</option>
                      <option value="afternoon">Afternoon (12pm - 5pm)</option>
                      <option value="evening">Evening (5pm - 8pm)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="block w-full pl-10 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what needs to be collected, any special instructions, etc."
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Photos (Optional)
                </label>
                <div className="flex flex-wrap -mx-2">
                  <div className="px-2 mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-300">
                      <ImageIcon size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Add photos to help drivers better understand the job</p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Estimated Price Range</h3>
                    <p className="text-sm text-gray-500">Drivers will place bids within this range</p>
                  </div>
                  <div className="text-xl font-semibold text-green-600">
                    {formData.service === 'half-truck' && '$70-90'}
                    {formData.service === 'full-truck' && '$110-130'}
                    {formData.service === 'more-than-truck' && '$170-200'}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Post Job
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJobPage;