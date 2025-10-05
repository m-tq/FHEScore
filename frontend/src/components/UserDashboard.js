import React, { useState, useEffect } from 'react';
import { isUserRegistered, hasUserCalculatedScore, registerUser, calculateScore, getContractConfig } from '../utils/contract';

const UserDashboard = ({ contract, userAddress, fhevm }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasScore, setHasScore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [contractConfig, setContractConfig] = useState(null);
  const [error, setError] = useState(null);

  // Load user status and contract config
  useEffect(() => {
    const loadUserStatus = async () => {
      if (!contract || !userAddress) return;

      try {
        setIsLoading(true);
        setError(null);

        const [registered, scoreCalculated, config] = await Promise.all([
          isUserRegistered(contract, userAddress),
          hasUserCalculatedScore(contract, userAddress),
          getContractConfig(contract)
        ]);

        setIsRegistered(registered);
        setHasScore(scoreCalculated);
        setContractConfig(config);
      } catch (err) {
        console.error('Failed to load user status:', err);
        setError('Failed to load user information');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStatus();
  }, [contract, userAddress]);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      setError(null);

      await registerUser(contract);
      setIsRegistered(true);
      
      console.log('✅ User registered successfully');
    } catch (err) {
      console.error('❌ Registration failed:', err);
      setError('Registration failed: ' + err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCalculateScore = async () => {
    try {
      setIsCalculating(true);
      setError(null);

      await calculateScore(contract);
      setHasScore(true);
      
      console.log('✅ Score calculated successfully');
    } catch (err) {
      console.error('❌ Score calculation failed:', err);
      setError('Score calculation failed: ' + err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="loading"></div>
        <p>Loading user dashboard...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>👤 User Dashboard</h2>
      
      {/* User Info */}
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Address:</strong> <code>{userAddress}</code></p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <span className={`status-indicator ${isRegistered ? 'status-connected' : 'status-disconnected'}`}>
            {isRegistered ? '✅ Registered' : '❌ Not Registered'}
          </span>
          <span className={`status-indicator ${hasScore ? 'status-connected' : 'status-disconnected'}`}>
            {hasScore ? '✅ Score Calculated' : '❌ No Score'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Registration Section */}
      {!isRegistered && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🚀 Get Started</h3>
          <p>Register to start building your private credit score.</p>
          <button 
            className="btn btn-success"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <>
                <span className="loading" style={{ marginRight: '10px' }}></span>
                Registering...
              </>
            ) : (
              '📝 Register Now'
            )}
          </button>
        </div>
      )}

      {/* Score Calculation Section */}
      {isRegistered && !hasScore && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🧮 Calculate Your Score</h3>
          <p>Calculate your credit score based on submitted activities.</p>
          <button 
            className="btn btn-success"
            onClick={handleCalculateScore}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <span className="loading" style={{ marginRight: '10px' }}></span>
                Calculating...
              </>
            ) : (
              '🔢 Calculate Score'
            )}
          </button>
        </div>
      )}

      {/* Score Update Section */}
      {isRegistered && hasScore && (
        <div style={{ marginBottom: '20px' }}>
          <h3>🔄 Update Your Score</h3>
          <p>Recalculate your score after submitting new activities.</p>
          <button 
            className="btn btn-secondary"
            onClick={handleCalculateScore}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <span className="loading" style={{ marginRight: '10px' }}></span>
                Recalculating...
              </>
            ) : (
              '🔄 Recalculate Score'
            )}
          </button>
        </div>
      )}

      {/* Contract Configuration */}
      {contractConfig && (
        <div>
          <h3>⚙️ Scoring Configuration</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', margin: '5px' }}>
              <strong>Repay Weight:</strong> +{contractConfig.repayWeight}
            </div>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', margin: '5px' }}>
              <strong>Default Penalty:</strong> -{contractConfig.defaultPenalty}
            </div>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', margin: '5px' }}>
              <strong>Staking Weight:</strong> +{contractConfig.stakingWeight}
            </div>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', margin: '5px' }}>
              <strong>Governance Weight:</strong> +{contractConfig.governanceWeight}
            </div>
            <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', margin: '5px' }}>
              <strong>Trading Weight:</strong> +{contractConfig.tradingWeight}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;