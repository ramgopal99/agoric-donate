import React, { createContext, useContext, useEffect, useState } from 'react';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { E } from '@endo/eventual-send';

interface ApplicationContextType {
  wallet: any;
  board: any;
}

const ApplicationContext = createContext<ApplicationContextType>({
  wallet: null,
  board: null,
});

export const ApplicationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    const connectToWallet = async () => {
      try {
        // Connect to the wallet
        const { connectLeapWallet } = await import('./walletConnection');
        const walletConnection = await connectLeapWallet();
        
        setWallet(walletConnection);
        setBoard(null);
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
      }
    };

    connectToWallet();
  }, []);

  return (
    <ApplicationContext.Provider value={{ wallet, board }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => useContext(ApplicationContext);
