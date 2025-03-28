import React, { useState } from 'react';
import axios from 'axios';
import { X, CreditCard } from 'lucide-react';

const PaymentModal = ({ job, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:5555/jobs/${job._id}/pay`, 
        { paymentMethod },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle successful payment
      onPaymentComplete(response.data);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Pay for Job</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Payment Details */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Job</p>
            <p className="font-medium">{job.jobType} - {job.pickupLocation}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ${job.estimatedPrice?.toFixed(2) || 'N/A'}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="form-radio"
                />
                <span>Credit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="form-radio"
                />
                <span>PayPal</span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={handlePayment}
              disabled={!paymentMethod || loading}
              className={`flex items-center px-4 py-2 rounded ${
                paymentMethod && !loading 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : (
                <>
                  <CreditCard size={16} className="mr-2" />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;