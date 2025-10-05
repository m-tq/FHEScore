import React from 'react';

const WalletConnection = ({ onConnect, isConnecting }) => {
  return (
    <div className="card text-center">
      <h2>🔗 Connect Your Wallet</h2>
      <p>Connect your MetaMask wallet to start using FHEScore</p>
      
      <div style={{ margin: '30px 0' }}>
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 auto', display: 'block' }}
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="#667eea" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="#667eea" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="#667eea" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button 
        className="btn"
        onClick={onConnect}
        disabled={isConnecting}
        style={{ fontSize: '18px', padding: '15px 30px' }}
      >
        {isConnecting ? (
          <>
            <span className="loading" style={{ marginRight: '10px' }}></span>
            Connecting...
          </>
        ) : (
          '🦊 Connect MetaMask'
        )}
      </button>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Don't have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Download here</a></p>
      </div>

      <div className="alert alert-info" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>🔒 Privacy Features:</h4>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Your credit score data is encrypted using FHEVM</li>
          <li>Only you can decrypt your personal score</li>
          <li>Third parties can verify your score without seeing the actual value</li>
          <li>All computations happen on encrypted data</li>
        </ul>
      </div>
    </div>
  );
};

export default WalletConnection;