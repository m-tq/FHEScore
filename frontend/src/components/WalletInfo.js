import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Wallet, Network } from 'lucide-react';

const WalletInfo = ({ 
  account, 
  chainId, 
  isCorrectNetwork, 
  getNetworkName, 
  onSwitchNetwork 
}) => {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="p-3">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Wallet Info</span>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Address:</span>
            <div className="font-mono text-sm bg-muted p-2 rounded border mt-1">
              {formatAddress(account)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Network className="w-3 h-3" />
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isCorrectNetwork 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
              }`}>
                {getNetworkName(chainId)}
              </span>
            </div>
            {!isCorrectNetwork && (
              <Button 
                variant="outline"
                size="sm"
                onClick={onSwitchNetwork}
                className="text-xs px-2 py-1 h-6"
              >
                Switch
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletInfo;