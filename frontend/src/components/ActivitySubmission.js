import React, { useState } from 'react';
import { ACTIVITY_TYPES, ACTIVITY_NAMES, submitActivity, isUserRegistered } from '../utils/contract';

const ActivitySubmission = ({ contract, contractAddress, userAddress, fhevm }) => {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES.REPAY);
  const [activityValue, setActivityValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activityValue || isNaN(activityValue) || Number(activityValue) <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Check if user is registered
      const registered = await isUserRegistered(contract, userAddress);
      if (!registered) {
        setError('You must register first before submitting activities');
        return;
      }

      // Encrypt the activity value
      const encryptedInputs = await fhevm.encryptValue(
        Number(activityValue),
        'uint32',
        contractAddress,
        userAddress
      );

      // Submit the activity
      const tx = await submitActivity(contract, activityType, encryptedInputs);
      
      setSuccess(`Activity submitted successfully! Transaction: ${tx.transactionHash}`);
      setActivityValue('');
      
      console.log('✅ Activity submitted:', {
        type: ACTIVITY_NAMES[activityType],
        value: activityValue,
        txHash: tx.transactionHash
      });
      
    } catch (err) {
      console.error('❌ Activity submission failed:', err);
      setError('Failed to submit activity: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3>📊 Submit Activity</h3>
      <p>Submit encrypted activity data to build your credit score.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="activityType">Activity Type:</label>
          <select
            id="activityType"
            value={activityType}
            onChange={(e) => setActivityType(Number(e.target.value))}
          >
            {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {ACTIVITY_NAMES[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="activityValue">
            Value:
            {activityType === ACTIVITY_TYPES.REPAY && ' (Number of repayments)'}
            {activityType === ACTIVITY_TYPES.DEFAULT && ' (Number of defaults)'}
            {activityType === ACTIVITY_TYPES.STAKING && ' (Staking duration in days)'}
            {activityType === ACTIVITY_TYPES.GOVERNANCE && ' (Number of votes)'}
            {activityType === ACTIVITY_TYPES.TRADING && ' (Trading volume)'}
          </label>
          <input
            id="activityValue"
            type="number"
            min="1"
            step="1"
            value={activityValue}
            onChange={(e) => setActivityValue(e.target.value)}
            placeholder="Enter activity value"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-success"
          disabled={isSubmitting || !fhevm.isReady}
        >
          {isSubmitting ? (
            <>
              <span className="loading" style={{ marginRight: '10px' }}></span>
              Submitting...
            </>
          ) : (
            '🔐 Submit Encrypted Activity'
          )}
        </button>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-danger" style={{ marginTop: '15px' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginTop: '15px' }}>
          {success}
        </div>
      )}

      {/* Activity Type Descriptions */}
      <div style={{ marginTop: '20px' }}>
        <h4>📋 Activity Types:</h4>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Loan Repayment:</strong> Increases your score significantly (+100 per repayment)</p>
          <p><strong>Loan Default:</strong> Decreases your score significantly (-200 per default)</p>
          <p><strong>Staking Activity:</strong> Moderate positive impact (+50 per day staked)</p>
          <p><strong>Governance Participation:</strong> Small positive impact (+30 per vote)</p>
          <p><strong>Trading Volume:</strong> Small positive impact (+20 per unit volume)</p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="alert alert-info" style={{ marginTop: '15px' }}>
        <strong>🔒 Privacy Notice:</strong> Your activity data is encrypted using FHEVM before being submitted to the blockchain. Only you can decrypt your personal information.
      </div>
    </div>
  );
};

export default ActivitySubmission;