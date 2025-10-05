import React, { useState } from 'react';
import { verifyUserScore, hasUserCalculatedScore } from '../utils/contract';

const VerificationPanel = ({ contract, userAddress }) => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [hasScore, setHasScore] = useState(null);

  // Check if user has calculated score
  React.useEffect(() => {
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

  const handleVerification = async () => {
    if (!contract || !userAddress) {
      setError('Contract or user address not available');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      setVerificationResult(null);

      // Check if user has calculated score first
      const scoreExists = await hasUserCalculatedScore(contract, userAddress);
      if (!scoreExists) {
        setError('You must calculate your score first before verification');
        return;
      }

      // Verify the score against threshold
      const result = await verifyUserScore(contract, userAddress);
      setVerificationResult(result);

      console.log('✅ Score verification completed:', result);
      
    } catch (err) {
      console.error('❌ Score verification failed:', err);
      setError('Verification failed: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setError(null);
  };

  if (hasScore === false) {
    return (
      <div className="card text-center">
        <h3>🔍 Score Verification</h3>
        <p>You need to calculate your score first before verification.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Go to the User Dashboard to calculate your score based on submitted activities.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>🔍 Score Verification</h3>
      <p>
        Verify if your credit score meets the minimum threshold without revealing your exact score.
        This provides privacy-preserving proof of creditworthiness.
      </p>

      {/* Verification Controls */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {verificationResult === null ? (
          <button 
            className="btn btn-primary"
            onClick={handleVerification}
            disabled={isVerifying || hasScore === false}
          >
            {isVerifying ? (
              <>
                <span className="loading" style={{ marginRight: '10px' }}></span>
                Verifying...
              </>
            ) : (
              '🔍 Verify Score Threshold'
            )}
          </button>
        ) : (
          <button 
            className="btn btn-secondary"
            onClick={resetVerification}
          >
            🔄 Run New Verification
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Verification Result */}
      {verificationResult !== null && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div 
            className={`alert ${verificationResult ? 'alert-success' : 'alert-warning'}`}
            style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              padding: '20px'
            }}
          >
            {verificationResult ? (
              <>
                ✅ <strong>VERIFIED</strong>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '10px' }}>
                  Your credit score meets or exceeds the minimum threshold of 700 points.
                </div>
              </>
            ) : (
              <>
                ❌ <strong>NOT VERIFIED</strong>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '10px' }}>
                  Your credit score is below the minimum threshold of 700 points.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div style={{ marginTop: '20px' }}>
        <h4>ℹ️ How Verification Works</h4>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
          <p>
            <strong>Privacy-Preserving:</strong> The verification process uses FHEVM's encrypted computation 
            to check if your score meets the threshold without revealing your exact score to anyone, 
            including the contract or third parties.
          </p>
          <p>
            <strong>Current Threshold:</strong> The minimum verification threshold is set to 700 points. 
            This threshold represents a "good" credit score level.
          </p>
          <p>
            <strong>Use Cases:</strong> Verification can be used for loan applications, credit checks, 
            or any scenario where you need to prove creditworthiness without revealing sensitive details.
          </p>
        </div>
      </div>

      {/* Threshold Information */}
      <div className="alert alert-info" style={{ marginTop: '15px' }}>
        <strong>🎯 Verification Threshold:</strong> 700 points
        <div style={{ fontSize: '14px', marginTop: '5px' }}>
          This threshold can be updated by the contract administrator to reflect changing credit standards.
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="alert alert-success" style={{ marginTop: '15px' }}>
        <strong>🔒 Zero-Knowledge Proof:</strong> This verification provides cryptographic proof of your 
        creditworthiness without revealing your actual score, maintaining complete privacy of your financial data.
      </div>

      {/* Improvement Suggestions */}
      {verificationResult === false && (
        <div className="alert alert-warning" style={{ marginTop: '15px' }}>
          <strong>💡 Improve Your Score:</strong>
          <ul style={{ marginTop: '10px', marginBottom: '0', fontSize: '14px' }}>
            <li>Submit more loan repayment activities (+100 points each)</li>
            <li>Increase staking participation (+50 points per day)</li>
            <li>Participate in governance voting (+30 points per vote)</li>
            <li>Maintain active trading (+20 points per unit volume)</li>
            <li>Avoid loan defaults (-200 points each)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VerificationPanel;