import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import WalletConnection from './WalletConnection';
import WalletInfo from './WalletInfo';
import NetworkSwitcher from './NetworkSwitcher';
import { Menu, X, Wifi, Wallet, Network, Shield } from 'lucide-react';

const MobileNav = ({ 
  isConnected, 
  isConnecting, 
  account, 
  walletError, 
  connectWallet, 
  disconnectWallet,
  chainId,
  isCorrectNetwork,
  switchToSepolia,
  getNetworkName,
  contract,
  fhevm
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleNav}
          className="h-10 w-10 p-0"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border p-4 space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6 mt-12">
              <h2 className="text-lg font-bold text-foreground">FHEScore</h2>
              <p className="text-xs text-muted-foreground">Control Panel</p>
            </div>

            {/* Network Status */}
            <Card className="custom-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="h-4 w-4" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <NetworkSwitcher
                  chainId={chainId}
                  isCorrectNetwork={isCorrectNetwork}
                  switchToSepolia={switchToSepolia}
                  getNetworkName={getNetworkName}
                />
              </CardContent>
            </Card>

            {/* Wallet Connection */}
            <Card className="custom-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-medium">Wallet</span>
                </div>
                <WalletConnection
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  account={account}
                  error={walletError}
                  connectWallet={connectWallet}
                  disconnectWallet={disconnectWallet}
                />
              </CardContent>
            </Card>

            {/* Wallet Info */}
            {isConnected && (
              <Card className="custom-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">Info</span>
                  </div>
                  <WalletInfo
                    account={account}
                    chainId={chainId}
                    isCorrectNetwork={isCorrectNetwork}
                    getNetworkName={getNetworkName}
                  />
                </CardContent>
              </Card>
            )}

            {/* FHEVM Status */}
            {isConnected && (
              <Card className="custom-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">FHEVM</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Instance:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        fhevm?.fhevmInstance ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {fhevm?.fhevmInstance ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Contract:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        contract ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {contract ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                    {fhevm?.isLoading && (
                      <div className="text-xs text-muted-foreground">Loading...</div>
                    )}
                    {fhevm?.error && (
                      <div className="text-xs text-destructive">Error</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;