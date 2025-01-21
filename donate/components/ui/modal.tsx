import React, { ReactNode } from 'react';
import { connectLeapWallet } from '../../../ui/src/walletConnection';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleDonateClick = async () => {
    try {
      const walletConnection = await connectLeapWallet();
      console.log('Connected to wallet:', walletConnection.address);
      // TODO: Implement contract invocation using walletConnection
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none transition-opacity duration-300 ${isOpen ? 'bg-black bg-opacity-50' : 'opacity-0'}`}>
      <div className="relative w-full max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Modal Title</h3>
            <button
              className="text-gray-900 dark:text-white bg-transparent border-0 text-2xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="relative flex-auto p-6 text-gray-800 dark:text-gray-200">
            {children}
          </div>
          <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-4">
            <button
              className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={handleDonateClick}
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModalBody = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);

export const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
    {children}
  </div>
);
