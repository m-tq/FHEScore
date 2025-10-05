import React, { useState } from 'react';
import { ACTIVITY_TYPES, ACTIVITY_NAMES, submitActivity, isUserRegistered } from '../utils/contract';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { BarChart3, Loader2, CheckCircle, AlertCircle, Info, Shield } from 'lucide-react';

const ActivitySubmission = ({ contract, contractAddress, userAddress, fhevm }) => {
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES.REPAY);
  const [activityValue, setActivityValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 Submit button clicked');
    
    if (!activityValue || isNaN(activityValue) || Number(activityValue) <= 0) {
      console.log('❌ Invalid activity value:', activityValue);
      setError('Please enter a valid positive number');
      return;
    }

    console.log('📊 Starting activity submission:', {
      activityType,
      activityValue,
      contract: !!contract,
      userAddress,
      fhevmReady: fhevm?.isReady
    });

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Check if user is registered
      console.log('🔍 Checking user registration...');
      const registered = await isUserRegistered(contract, userAddress);
      console.log('✅ User registration status:', registered);
      
      if (!registered) {
        console.log('❌ User not registered');
        setError('You must register first before submitting activities');
        return;
      }

      // Check if FHEVM is ready
      console.log('🔍 Checking FHEVM status...');
      if (!fhevm?.isReady) {
        console.log('❌ FHEVM not ready:', fhevm);
        setError('FHEVM is not ready. Please wait and try again.');
        return;
      }
      console.log('✅ FHEVM is ready');

      // Encrypt the activity value
      console.log('🔐 Starting encryption process...');
      const encryptedInputs = await fhevm.encryptValue(
        Number(activityValue),
        'uint32',
        contractAddress,
        userAddress
      );
      console.log('✅ Encryption completed:', encryptedInputs);

      // Submit the activity
      console.log('📤 Submitting activity to contract...');
      const tx = await submitActivity(contract, activityType, encryptedInputs);
      console.log('✅ Transaction submitted:', tx);
      
      setSuccess(`Activity submitted successfully! Transaction: ${tx.transactionHash}`);
      setActivityValue('');
      
      console.log('✅ Activity submitted:', {
        type: ACTIVITY_NAMES[activityType],
        value: activityValue,
        txHash: tx.transactionHash
      });
      
    } catch (err) {
      console.error('❌ Activity submission failed:', err);
      console.error('❌ Error details:', {
        message: err.message,
        code: err.code,
        data: err.data,
        stack: err.stack
      });
      setError('Failed to submit activity: ' + err.message);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Submit process completed');
    }
  };

  const getActivityDescription = (type) => {
    switch (type) {
      case ACTIVITY_TYPES.REPAY:
        return 'Number of repayments';
      case ACTIVITY_TYPES.DEFAULT:
        return 'Number of defaults';
      case ACTIVITY_TYPES.STAKING:
        return 'Staking duration in days';
      case ACTIVITY_TYPES.GOVERNANCE:
        return 'Number of votes';
      case ACTIVITY_TYPES.TRADING:
        return 'Trading volume';
      default:
        return 'Activity value';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Submit Activity
        </CardTitle>
        <CardDescription>
          Submit encrypted activity data to build your credit score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="activityType" className="text-sm font-medium">
              Activity Type:
            </label>
            <select
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {ACTIVITY_NAMES[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="activityValue" className="text-sm font-medium">
              Value ({getActivityDescription(activityType)}):
            </label>
            <Input
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

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !fhevm?.isReady}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Submit Encrypted Activity
              </>
            )}
          </Button>
        </form>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/15 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Activity Type Descriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 Activity Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Loan Repayment:</strong> Increases your score significantly (+100 per repayment)</p>
            <p><strong>Loan Default:</strong> Decreases your score significantly (-200 per default)</p>
            <p><strong>Staking Activity:</strong> Moderate positive impact (+50 per day staked)</p>
            <p><strong>Governance Participation:</strong> Small positive impact (+30 per vote)</p>
            <p><strong>Trading Volume:</strong> Small positive impact (+20 per unit volume)</p>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Privacy Notice:</strong> Your activity data is encrypted using FHEVM before being submitted to the blockchain. Only you can decrypt your personal information.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySubmission;