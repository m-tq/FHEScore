import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import WalletConnection from './WalletConnection';
import WalletInfo from './WalletInfo';
import NetworkSwitcher from './NetworkSwitcher';
import { ChevronLeft, ChevronRight, Wifi, Wallet, Network, Shield } from 'lucide-react';

const Sidebar = ({ 
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
  fhevm,
  onToggle
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-80'
    } hidden lg:block`}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-4 space-y-4 overflow-y-auto h-full">
        {/* Header */}
        <div className="text-center mb-6">
          {!isCollapsed ? (
            <>
              <h2 className="text-lg font-bold text-foreground">FHEScore</h2>
              <p className="text-xs text-muted-foreground">Control Panel</p>
            </>
          ) : (
            <div className="text-2xl">🔐</div>
          )}
        </div>

        {/* Network Status */}
        <Card className="custom-card">
          {!isCollapsed && (
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Network className="h-4 w-4" />
                Network
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className={isCollapsed ? "p-2" : "pt-0"}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className={`w-3 h-3 rounded-full ${
                  isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
            ) : (
              <NetworkSwitcher
                chainId={chainId}
                isCorrectNetwork={isCorrectNetwork}
                switchToSepolia={switchToSepolia}
                getNetworkName={getNetworkName}
              />
            )}
          </CardContent>
        </Card>

        {/* Wallet Connection */}
        <Card className="custom-card">
          {!isCollapsed && (
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </CardTitle>
            </CardHeader>
          )}
          <CardContent className={isCollapsed ? "p-2" : "pt-0"}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
            ) : (
              <WalletConnection
                isConnected={isConnected}
                isConnecting={isConnecting}
                account={account}
                error={walletError}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
              />
            )}
          </CardContent>
        </Card>

        {/* Wallet Info */}
        {isConnected && (
          <Card className="custom-card">
            {!isCollapsed && (
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Info
                </CardTitle>
              </CardHeader>
            )}
            <CardContent className={isCollapsed ? "p-2" : "pt-0"}>
              {isCollapsed ? (
                <div className="flex justify-center">
                  <Wallet className="h-4 w-4 text-blue-500" />
                </div>
              ) : (
                <WalletInfo
                  account={account}
                  chainId={chainId}
                  isCorrectNetwork={isCorrectNetwork}
                  getNetworkName={getNetworkName}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* FHEVM Status */}
        {isConnected && (
          <Card className="custom-card">
            {!isCollapsed && (
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  FHEVM
                </CardTitle>
              </CardHeader>
            )}
            <CardContent className={isCollapsed ? "p-2" : "pt-0"}>
              {isCollapsed ? (
                <div className="flex justify-center">
                  <div className={`w-3 h-3 rounded-full ${
                    fhevm?.fhevmInstance && contract ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Sidebar;