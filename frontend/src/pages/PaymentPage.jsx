import React, { useState } from 'react';
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Sample booking details
  const booking = {
    service: 'Full Truck',
    date: '2025-03-22',
    time: '10:00 AM',
    address: '123 Main St, Anytown',
    driver: 'James Wilson',
    driverRating: 4.9,
    price: 120,
    serviceFee: 15,
    total: 135
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for your booking. We've sent the details to your email.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">BK12345678</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{booking.date} at {booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-medium">${booking.total}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/dashboard" className="flex-1">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700">
                  View Dashboard
                </button>
              </Link>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50">
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="text-green-600 hover:text-green-800">
              <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Payment</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex space-x-4">
                    <div 
                      className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border ${
                          paymentMethod === 'card' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {paymentMethod === 'card' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                        <span className="ml-3 font-medium">Credit Card</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === 'paypal' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border ${
                          paymentMethod === 'paypal' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {paymentMethod === 'paypal' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                        <span className="ml-3 font-medium">PayPal</span>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                          placeholder="Full name as displayed on card"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCardIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="cardNumber"
                            className="block w-full pl-10 py-2 border border-gray-300 rounded-md"
                            placeholder="XXXX XXXX XXXX XXXX"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            id="expDate"
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                            placeholder="MM / YY"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md"
                            placeholder="XXX"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'paypal' && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        `Pay $${booking.total}`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{booking.service}</h3>
                    <p className="text-sm text-gray-500">{booking.date} at {booking.time}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Driver</span>
                    <span className="font-medium">{booking.driver}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <span className="mr-1">{booking.driverRating}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium text-right">{booking.address}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span>${booking.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Platform Fee</span>
                    <span>${booking.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-4">
                    <span>Total</span>
                    <span>${booking.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;