import React, { useState, useEffect } from 'react';
import { getUserScore, getUserActivities, hasUserCalculatedScore } from '../utils/contract';

const ScoreDisplay = ({ contract, contractAddress, userAddress, fhevm }) => {
  const [score, setScore] = useState(null);
  const [activities, setActivities] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasScore, setHasScore] = useState(false);

  // Check if user has calculated score
  useEffect(() => {
    const checkScoreStatus = async () => {
      if (!contract || !userAddress) return;

      try {
        const scoreExists = await hasUserCalculatedScore(contract, userAddress);
        setHasScore(scoreExists);
      } catch (err) {
        console.error('Failed to check score status:', err);
      }
    };

    checkScoreStatus();
  }, [contract, userAddress]);

  const loadScoreAndActivities = async () => {
    if (!contract || !userAddress || !fhevm.isReady) {
      setError('Contract or FHEVM not ready');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get encrypted score and activities
      const [encryptedScore, encryptedActivities] = await Promise.all([
        getUserScore(contract),
        getUserActivities(contract)
      ]);

      // Decrypt score
      const decryptedScore = await fhevm.decryptValue(
        encryptedScore,
        'uint32',
        contractAddress,
        userAddress
      );

      // Decrypt activities
      const decryptedActivities = {
        repayCount: await fhevm.decryptValue(
          encryptedActivities.repayCount,
          'uint32',
          contractAddress,
          userAddress
        ),
        defaultCount: await fhevm.decryptValue(
          encryptedActivities.defaultCount,
          'uint32',
          contractAddress,
          userAddress
        ),
        stakingDays: await fhevm.decryptValue(
          encryptedActivities.stakingDays,
          'uint32',
          contractAddress,
          userAddress
        ),
        governanceVotes: await fhevm.decryptValue(
          encryptedActivities.governanceVotes,
          'uint32',
          contractAddress,
          userAddress
        ),
        tradingVolume: await fhevm.decryptValue(
          encryptedActivities.tradingVolume,
          'uint32',
          contractAddress,
          userAddress
        )
      };

      setScore(decryptedScore);
      setActivities(decryptedActivities);

      console.log('✅ Score and activities decrypted successfully');
      
    } catch (err) {
      console.error('❌ Failed to load score and activities:', err);
      setError('Failed to decrypt data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 800) return '#28a745'; // Green
    if (score >= 700) return '#ffc107'; // Yellow
    if (score >= 600) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  };

  const getScoreRating = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  if (!hasScore) {
    return (
      <div className="card text-center">
        <h3>📊 Your Credit Score</h3>
        <p>You need to calculate your score first.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Go to the User Dashboard to calculate your score based on submitted activities.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>📊 Your Credit Score</h3>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          className="btn btn-primary"
          onClick={loadScoreAndActivities}
          disabled={isLoading || !fhevm.isReady}
        >
          {isLoading ? (
            <>
              <span className="loading" style={{ marginRight: '10px' }}></span>
              Decrypting...
            </>
          ) : (
            '🔓 Decrypt & View Score'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Score Display */}
      {score !== null && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div 
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: getScoreColor(score),
              marginBottom: '10px'
            }}
          >
            {score}
          </div>
          <div 
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: getScoreColor(score),
              marginBottom: '5px'
            }}
          >
            {getScoreRating(score)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Credit Score Range: 0 - 1000+
          </div>
        </div>
      )}

      {/* Activities Breakdown */}
      {activities && (
        <div>
          <h4>📋 Activity Breakdown</h4>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {activities.repayCount}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Loan Repayments</div>
              <div style={{ fontSize: '12px', color: '#28a745' }}>+{activities.repayCount * 100} points</div>
            </div>

            <div style={{ padding: '15px', background: '#f8e8e8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {activities.defaultCount}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Loan Defaults</div>
              <div style={{ fontSize: '12px', color: '#dc3545' }}>-{activities.defaultCount * 200} points</div>
            </div>

            <div style={{ padding: '15px', background: '#e8f4f8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
                {activities.stakingDays}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Staking Days</div>
              <div style={{ fontSize: '12px', color: '#17a2b8' }}>+{activities.stakingDays * 50} points</div>
            </div>

            <div style={{ padding: '15px', background: '#f0e8f8', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
                {activities.governanceVotes}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Governance Votes</div>
              <div style={{ fontSize: '12px', color: '#6f42c1' }}>+{activities.governanceVotes * 30} points</div>
            </div>

            <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
                {activities.tradingVolume}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Trading Volume</div>
              <div style={{ fontSize: '12px', color: '#fd7e14' }}>+{activities.tradingVolume * 20} points</div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="alert alert-info" style={{ marginTop: '20px' }}>
        <strong>🔒 Privacy Protected:</strong> Your score and activity data are encrypted on-chain. Only you can decrypt and view this information using your private key.
      </div>

      {/* Score Improvement Tips */}
      {score !== null && score < 700 && (
        <div className="alert alert-warning" style={{ marginTop: '15px' }}>
          <strong>💡 Improve Your Score:</strong>
          <ul style={{ marginTop: '10px', marginBottom: '0' }}>
            <li>Make more loan repayments (+100 points each)</li>
            <li>Participate in staking (+50 points per day)</li>
            <li>Vote in governance proposals (+30 points each)</li>
            <li>Increase trading activity (+20 points per unit)</li>
            <li>Avoid loan defaults (-200 points each)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;