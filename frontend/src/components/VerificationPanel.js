import React, { useState } from 'react';
import { verifyUserScore, hasUserCalculatedScore } from '../utils/contract';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Search, Loader2, CheckCircle, XCircle, RefreshCw, Info, Target, Shield, Lightbulb, AlertCircle } from 'lucide-react';

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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Search className="h-5 w-5" />
            Score Verification
          </CardTitle>
          <CardDescription>
            You need to calculate your score first before verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Go to the User Dashboard to calculate your score based on submitted activities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Score Verification
        </CardTitle>
        <CardDescription>
          Verify if your credit score meets the minimum threshold without revealing your exact score.
          This provides privacy-preserving proof of creditworthiness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Controls */}
        <div className="flex justify-center">
          {verificationResult === null ? (
            <Button 
              onClick={handleVerification}
              disabled={isVerifying || hasScore === false}
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verify Score Threshold
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={resetVerification}
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Run New Verification
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/15 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult !== null && (
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className={`p-6 rounded-lg ${verificationResult 
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' 
                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
              }`}>
                <div className="flex items-center justify-center gap-2 text-lg font-bold mb-2">
                  {verificationResult ? (
                    <>
                      <CheckCircle className="h-6 w-6" />
                      VERIFIED
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6" />
                      NOT VERIFIED
                    </>
                  )}
                </div>
                <p className="text-sm font-normal">
                  {verificationResult 
                    ? 'Your credit score meets or exceeds the minimum threshold of 700 points.'
                    : 'Your credit score is below the minimum threshold of 700 points.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4" />
              How Verification Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
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
          </CardContent>
        </Card>

        {/* Threshold Information */}
        <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Verification Threshold:</strong> 700 points
            <div className="mt-1 text-xs">
              This threshold can be updated by the contract administrator to reflect changing credit standards.
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-3 rounded-md bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Zero-Knowledge Proof:</strong> This verification provides cryptographic proof of your 
            creditworthiness without revealing your actual score, maintaining complete privacy of your financial data.
          </div>
        </div>

        {/* Improvement Suggestions */}
        {verificationResult === false && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <strong>Improve Your Score:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Submit more loan repayment activities (+100 points each)</li>
                <li>• Increase staking participation (+50 points per day)</li>
                <li>• Participate in governance voting (+30 points per vote)</li>
                <li>• Maintain active trading (+20 points per unit volume)</li>
                <li>• Avoid loan defaults (-200 points each)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationPanel;