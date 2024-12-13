/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAgoricChainStorageWatcher } from '@agoric/rpc';
import { suggestChain } from '@agoric/web-components';

const ENDPOINTS = {
  RPC: 'http://127.0.0.1:26657',
  API: 'http://127.0.0.1:1317',
};

export interface WalletConnection {
  address: string;
  signer: any;
  watcher: any;
}

export const connectLeapWallet = async (): Promise<WalletConnection> => {
  // Check if Leap Wallet is installed
  if (!(window as any).leap) {
    throw new Error('Leap Wallet extension not found');
  }

  try {
    // Configure chain for local development
    await suggestChain('https://local.agoric.net/network-config');
    
    // Request wallet connection
    await (window as any).leap.enable('agoriclocal');
    
    // Get account information
    const [account] = await (window as any).leap.getOfflineSigner('agoriclocal').getAccounts();
    
    return {
      address: account.address,
      signer: (window as any).leap.getOfflineSigner('agoriclocal'),
      watcher: makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal'),
    };
  } catch (error) {
    console.error('Failed to connect to Leap Wallet:', error);
    throw error;
  }
};
