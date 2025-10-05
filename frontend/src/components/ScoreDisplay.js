import React, { useState, useEffect } from 'react';
import { getUserScore, getUserActivities, hasUserCalculatedScore } from '../utils/contract';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart3, Unlock, Shield, TrendingUp, Loader2, AlertCircle, Lightbulb } from 'lucide-react';

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
    if (!contract || !userAddress || !fhevm?.isReady) {
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
    if (score >= 800) return 'text-green-600 dark:text-green-400';
    if (score >= 700) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 600) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 800) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 700) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (score >= 600) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getScoreRating = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  if (!hasScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Your Credit Score</span>
          </CardTitle>
          <CardDescription>
            View your private credit score and activity breakdown
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="font-medium">No score calculated yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go to the User Dashboard to calculate your score based on submitted activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Your Credit Score</span>
          </CardTitle>
          <CardDescription>
            Decrypt and view your private credit score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button 
              onClick={loadScoreAndActivities}
              disabled={isLoading || !fhevm?.isReady}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Decrypt & View Score
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Score Display */}
          {score !== null && (
            <Card className={`border-2 ${getScoreBgColor(score)}`}>
              <CardContent className="text-center py-8">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}
                </div>
                <div className={`text-xl font-semibold mb-2 ${getScoreColor(score)}`}>
                  {getScoreRating(score)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Credit Score Range: 0 - 1000+
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Activities Breakdown */}
      {activities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Activity Breakdown</span>
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your credit-building activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {activities.repayCount}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Loan Repayments</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    +{activities.repayCount * 100} points
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {activities.defaultCount}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Loan Defaults</div>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    -{activities.defaultCount * 200} points
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {activities.stakingDays}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Staking Days</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    +{activities.stakingDays * 50} points
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {activities.governanceVotes}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Governance Votes</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    +{activities.governanceVotes * 30} points
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {activities.tradingVolume}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Trading Volume</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    +{activities.tradingVolume * 20} points
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Privacy Protected</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your score and activity data are encrypted on-chain. Only you can decrypt and view this information using your private key.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Improvement Tips */}
      {score !== null && score < 700 && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Improve Your Score</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Make more loan repayments (+100 points each)</li>
                  <li>• Participate in staking (+50 points per day)</li>
                  <li>• Vote in governance proposals (+30 points each)</li>
                  <li>• Increase trading activity (+20 points per unit)</li>
                  <li>• Avoid loan defaults (-200 points each)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScoreDisplay;