import React from 'react';
import { Button } from './ui/button';
import { Wallet, Loader2 } from 'lucide-react';

const WalletConnection = ({ isConnected, isConnecting, account, error, connectWallet, disconnectWallet }) => {
  if (isConnected) {
    return (
      <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            disconnectWallet();
          }}
          className="text-xs px-2 py-1 h-6 text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/30"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Connect your MetaMask wallet to start using FHEScore
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm font-medium">
            Connection Error: {error}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          size="lg"
          className="min-w-[200px]"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Make sure you have MetaMask installed and unlocked
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;