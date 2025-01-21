'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const ThankYouPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasSubmitted = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const submitData = async () => {
      // Check both state and ref to prevent double submission
      if (isSubmitted || hasSubmitted.current) return;
      
      const walletId = searchParams.get('walletId');
      const donationAmount = searchParams.get('donationAmount');
      const adminAmount = searchParams.get('adminAmount');
      const donationId = searchParams.get('donationId');

      if (!walletId || !donationAmount || !adminAmount) return;

      // Set ref immediately to prevent race conditions
      hasSubmitted.current = true;
      setIsSubmitting(true);

      try {
        const data = {
          walletId,
          adminAmount: parseFloat(adminAmount),
          userDonation: parseFloat(donationAmount) - parseFloat(adminAmount),
          donationId: donationId ? donationId : undefined
        };

        const response = await fetch('/api/donedonate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to process donation');
        }

        setIsSubmitted(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error processing donation');
        console.error('Error:', error);
        // Reset the ref if there's an error to allow retry
        hasSubmitted.current = false;
      } finally {
        setIsSubmitting(false);
      }
    };

    submitData();
  }, []); // Empty dependency array since we use ref for tracking

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        {error ? (
          <div className="text-red-500 dark:text-red-400 text-center mb-4">{error}</div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Thank You!</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your generous donation has been successfully processed.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Total Donation:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    ${searchParams.get('donationAmount')}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Admin Fee:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    ${searchParams.get('adminAmount')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Net Donation:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ${(parseFloat(searchParams.get('donationAmount') || '0') - parseFloat(searchParams.get('adminAmount') || '0')).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Your contribution makes a real difference. We appreciate your support!
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ThankYouPage;