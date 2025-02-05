/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import './App.css';
import { connectLeapWallet } from './walletConnection';
import { motion } from 'framer-motion';

interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
}

function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [items] = useState<Item[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [balance, setBalance] = useState(1000);
  const [donationId, setDonationId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('donationId');
    if (id) {
      setDonationId(id);
    }
  }, []);

  const handleConnect = async () => {
    try {
      const connection = await connectLeapWallet();
      setWallet(connection.address);
      setWalletConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (wallet) {
        const balance = await getTestWalletBalance(wallet);
        setWalletBalance(balance);
      }
    };
    fetchWalletBalance();
  }, [wallet]);

  const getTestWalletBalance = async (walletId: string): Promise<number> => {
    return 1000;
  };

  const logTransaction = (walletId: string, donationAmount: number, adminFee: number) => {
    const transactionDetails = `Wallet ID: ${walletId}, Donation Amount: ${donationAmount}, Admin Fee: ${adminFee}`;
    console.log(transactionDetails);
  };

  const handleDonate = async () => {
    if (!wallet) {
      alert('Please connect your Leap Cosmos wallet first.');
      return;
    }
    try {
      const approval = await requestLeapApproval(donationAmount);
      if (approval) {
        const adminFee = donationAmount * 0.01;
        const userDonation = donationAmount - adminFee;
        const walletId = wallet;
        logTransaction(walletId, userDonation, adminFee);

        alert(`Donation of ${userDonation} IST approved!`);
        handleDonation(-donationAmount);

        const redirectUrl = new URL('http://localhost:3000/dashboard/done');
        redirectUrl.searchParams.set('walletId', walletId);
        redirectUrl.searchParams.set('donationAmount', donationAmount.toString());
        redirectUrl.searchParams.set('adminAmount', adminFee.toString());
        if (donationId) {
          redirectUrl.searchParams.set('donationId', donationId);
        }

        window.location.href = redirectUrl.toString();
      } else {
        alert('Donation not approved.');
      }
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      const newBalance = await getTestWalletBalance(wallet);
      setWalletBalance(newBalance);
    }
  };

  const requestLeapApproval = async (amount: number): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  };

  const handleDonation = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  return (
    <div className="app-container">
      <div className="background-effects">
        <div className="gradient-circle circle1"></div>
        <div className="gradient-circle circle2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="content-wrapper"
      >
        <h1 className="title">Agoric Donation Platform</h1>

        {donationId && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="donation-id-card"
          >
            <span className="label">Donation ID:</span>
            <span className="value">{donationId}</span>
          </motion.div>
        )}

        <div className="wallet-section">
          {!walletConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="connect-button glow-effect"
              onClick={handleConnect}
            >
              Connect Leap Wallet
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="wallet-info"
            >
              <div className="wallet-details">
                <div className="detail-item">
                  <span className="label">Wallet Address:</span>
                  <span className="value">{wallet}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Balance:</span>
                  <span className="value highlight">{walletBalance} IST</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="donation-section glass-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="input-group">
            <label htmlFor="donation">Donation Amount (IST)</label>
            <input
              type="number"
              id="donation"
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              min="0"
              className="donation-input"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="donate-button glow-effect"
            onClick={handleDonate}
            disabled={!walletConnected || donationAmount <= 0}
          >
            <span className="button-content">
              <span className="icon">💝</span>
              Donate Now
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
