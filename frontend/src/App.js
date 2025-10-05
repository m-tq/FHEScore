import React, { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { useFHEVM } from './hooks/useFHEVM';
import WalletConnection from './components/WalletConnection';
import UserDashboard from './components/UserDashboard';
import ActivitySubmission from './components/ActivitySubmission';
import ScoreDisplay from './components/ScoreDisplay';
import VerificationPanel from './components/VerificationPanel';
import NetworkSwitcher from './components/NetworkSwitcher';
import { createContractInstance } from './utils/contract';
import { getContractAddress } from './config/contracts';

function App() {
  const wallet = useWallet();
  const fhevm = useFHEVM();
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);

  // Get contract address automatically based on current network
  useEffect(() => {
    if (wallet.chainId) {
      const address = getContractAddress(wallet.chainId);
      setContractAddress(address);
      console.log(`📋 Contract address for chain ${wallet.chainId}:`, address);
    }
  }, [wallet.chainId]);

  // Create contract instance when wallet and FHEVM are ready
  useEffect(() => {
    if (wallet.signer && contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
      try {
        const contractInstance = createContractInstance(contractAddress, wallet.signer);
        setContract(contractInstance);
        console.log('✅ Contract instance created:', contractAddress);
      } catch (error) {
        console.error('❌ Failed to create contract instance:', error);
      }
    } else {
      setContract(null);
    }
  }, [wallet.signer, contractAddress]);

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-3">
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }}>
            🔐 FHEScore
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.2rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Private Credit Score System using FHEVM
          </p>
        </header>

        {/* Network Switcher */}
        <NetworkSwitcher />

        {/* Status Indicators */}
        <div className="card">
          <h3>System Status</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="status-indicator">
              <span className={`status-indicator ${wallet.isConnected ? 'status-connected' : 'status-disconnected'}`}>
                Wallet: {wallet.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="status-indicator">
              <span className={`status-indicator ${fhevm.isReady ? 'status-connected' : 'status-disconnected'}`}>
                FHEVM: {fhevm.isReady ? 'Ready' : fhevm.isLoading ? 'Loading...' : 'Error'}
              </span>
            </div>
            
            <div className="status-indicator">
              <span className={`status-indicator ${fhevm.currentNetwork ? 'status-connected' : 'status-disconnected'}`}>
                Network: {fhevm.currentNetwork ? fhevm.currentNetwork.name : wallet.chainId ? wallet.getNetworkName(wallet.chainId) : 'Unknown'}
              </span>
            </div>

            <div className="status-indicator">
              <span className={`status-indicator ${contract ? 'status-connected' : 'status-disconnected'}`}>
                Contract: {contract ? 'Connected' : contractAddress ? 'Address Found' : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Contract Address Display */}
          {contractAddress && (
            <div className="mt-3">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Contract Address:
              </label>
              <div style={{ 
                padding: '10px', 
                background: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
                wordBreak: 'break-all'
              }}>
                {contractAddress}
              </div>
            </div>
          )}

          {!contractAddress && wallet.chainId && (
            <div className="mt-3">
              <div style={{ 
                padding: '10px', 
                background: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '4px',
                color: '#856404'
              }}>
                ⚠️ No contract deployed on this network (Chain ID: {wallet.chainId})
              </div>
            </div>
          )}
        </div>

        {/* Error Messages */}
        {wallet.error && (
          <div className="alert alert-danger">
            <strong>Wallet Error:</strong> {wallet.error}
          </div>
        )}

        {fhevm.error && (
          <div className="alert alert-danger">
            <strong>FHEVM Error:</strong> {fhevm.error}
          </div>
        )}

        {/* Wallet Connection */}
        {!wallet.isConnected && (
          <WalletConnection 
            onConnect={wallet.connectWallet}
            isConnecting={wallet.isConnecting}
          />
        )}

        {/* Main Application */}
        {wallet.isConnected && fhevm.isReady && contract && (
          <>
            {/* User Dashboard */}
            <UserDashboard 
              contract={contract}
              userAddress={wallet.account}
              fhevm={fhevm}
            />

            {/* Main Content Grid */}
            <div className="grid">
              {/* Activity Submission */}
              <ActivitySubmission 
                contract={contract}
                contractAddress={contractAddress}
                userAddress={wallet.account}
                fhevm={fhevm}
              />

              {/* Score Display */}
              <ScoreDisplay 
                contract={contract}
                contractAddress={contractAddress}
                userAddress={wallet.account}
                fhevm={fhevm}
                signer={wallet.signer}
              />
            </div>

            {/* Verification Panel */}
            <VerificationPanel 
              contract={contract}
              contractAddress={contractAddress}
              fhevm={fhevm}
              signer={wallet.signer}
            />
          </>
        )}

        {/* Loading States */}
        {fhevm.isLoading && (
          <div className="card text-center">
            <div className="loading"></div>
            <p>Initializing FHEVM...</p>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Built with ❤️ using Zama's FHEVM | 
            <a 
              href="https://docs.zama.ai/fhevm" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.9)', marginLeft: '5px' }}
            >
              Learn More
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;