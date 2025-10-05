import React, { useState, useEffect } from 'react';
import { isUserRegistered, hasUserCalculatedScore, registerUser, calculateScore, getContractConfig } from '../utils/contract';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, CheckCircle, XCircle, Calculator, RefreshCw, Settings, Loader2 } from 'lucide-react';

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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-muted-foreground">Loading user dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>User Dashboard</span>
          </CardTitle>
          <CardDescription>
            Manage your registration and credit score calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Wallet Address</p>
              <code className="text-sm bg-muted px-2 py-1 rounded font-mono break-all">
                {userAddress}
              </code>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isRegistered 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {isRegistered ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>{isRegistered ? 'Registered' : 'Not Registered'}</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                hasScore 
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {hasScore ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>{hasScore ? 'Score Calculated' : 'No Score'}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Registration Section */}
          {!isRegistered && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚀 Get Started</CardTitle>
                <CardDescription>
                  Register to start building your private credit score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full sm:w-auto"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Register Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Score Calculation Section */}
          {isRegistered && !hasScore && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🧮 Calculate Your Score</CardTitle>
                <CardDescription>
                  Calculate your credit score based on submitted activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCalculateScore}
                  disabled={isCalculating}
                  className="w-full sm:w-auto"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Score
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Score Update Section */}
          {isRegistered && hasScore && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔄 Update Your Score</CardTitle>
                <CardDescription>
                  Recalculate your score after submitting new activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline"
                  onClick={handleCalculateScore}
                  disabled={isCalculating}
                  className="w-full sm:w-auto"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recalculating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recalculate Score
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Contract Configuration */}
      {contractConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Scoring Configuration</span>
            </CardTitle>
            <CardDescription>
              Current weights and penalties used in score calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Repay Weight</div>
                <div className="text-lg font-semibold text-green-600">+{contractConfig.repayWeight}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Default Penalty</div>
                <div className="text-lg font-semibold text-red-600">-{contractConfig.defaultPenalty}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Staking Weight</div>
                <div className="text-lg font-semibold text-green-600">+{contractConfig.stakingWeight}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Governance Weight</div>
                <div className="text-lg font-semibold text-green-600">+{contractConfig.governanceWeight}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Trading Weight</div>
                <div className="text-lg font-semibold text-green-600">+{contractConfig.tradingWeight}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;