import React from 'react';
import { Button } from './ui/button';
import { Network, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFHEVM } from '../hooks/useFHEVM';

const NetworkSwitcher = ({ chainId, isCorrectNetwork, switchToSepolia, getNetworkName }) => {
  const { currentNetwork, error } = useFHEVM();
  
  // If props are provided, use them (new implementation)
  if (chainId !== undefined && isCorrectNetwork !== undefined) {
    const networkName = chainId ? getNetworkName(chainId) : 'Unknown';
    
    if (isCorrectNetwork) {
      return (
        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {networkName}
            </span>
          </div>
          <span className="text-xs font-mono text-green-700 dark:text-green-300">
            ID: {chainId}
          </span>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Wrong Network: {networkName}
            </span>
          </div>
          <Button 
            onClick={switchToSepolia}
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 h-6 text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-700 dark:hover:bg-yellow-900/30"
          >
            Switch
          </Button>
        </div>
      </div>
    );
  }

  // Fallback to original implementation if no props provided
  if (!error && currentNetwork) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              {currentNetwork.name}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              ✅ FHEVM Ready
            </p>
          </div>
        </div>
        <Network className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
    );
  }

  // Hide the FHEVM Network Required card - return null instead of showing error
  return null;
};

export default NetworkSwitcher;