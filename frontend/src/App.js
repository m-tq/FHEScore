import React, { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { useFHEVM } from './hooks/useFHEVM';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import UserDashboard from './components/UserDashboard';
import ActivitySubmission from './components/ActivitySubmission';
import ScoreDisplay from './components/ScoreDisplay';
import VerificationPanel from './components/VerificationPanel';
import { createContractInstance } from './utils/contract';
import { getContractAddress } from './config/contracts';

function AppContent() {
  const {
    signer,
    account,
    chainId,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    error: walletError,
    refreshTrigger,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    getNetworkName,
  } = useWallet();
  const fhevm = useFHEVM();
  const [contract, setContract] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Create contract instance when wallet and FHEVM are ready
  useEffect(() => {
    const initContract = async () => {
      console.log('🔍 Contract initialization check:', {
        signer: !!signer,
        fhevmInstance: !!fhevm.fhevmInstance,
        chainId,
        fhevmLoading: fhevm.isLoading,
        fhevmError: fhevm.error
      });

      if (signer && fhevm.fhevmInstance && chainId) {
        try {
          const contractAddress = getContractAddress(chainId);
          console.log('📍 Contract address for chain', chainId, ':', contractAddress);
          
          if (contractAddress) {
            const contractInstance = await createContractInstance(
              contractAddress,
              signer,
              fhevm.fhevmInstance
            );
            setContract(contractInstance);
            console.log('✅ Contract initialized:', contractAddress);
          } else {
            console.warn('⚠️ No contract address for chain:', chainId);
            setContract(null);
          }
        } catch (error) {
          console.error('❌ Failed to initialize contract:', error);
          setContract(null);
        }
      } else {
        console.log('⏳ Waiting for dependencies:', {
          needsSigner: !signer,
          needsFHEVM: !fhevm.fhevmInstance,
          needsChainId: !chainId
        });
        setContract(null);
      }
    };

    initContract();
  }, [signer, fhevm.fhevmInstance, chainId, refreshTrigger, fhevm.isLoading, fhevm.error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isConnected={isConnected}
        isConnecting={isConnecting}
        account={account}
        walletError={walletError}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        chainId={chainId}
        isCorrectNetwork={isCorrectNetwork}
        switchToSepolia={switchToSepolia}
        getNetworkName={getNetworkName}
        contract={contract}
        fhevm={fhevm}
        onToggle={setIsSidebarCollapsed}
      />

      {/* Mobile Navigation */}
      <MobileNav
        isConnected={isConnected}
        isConnecting={isConnecting}
        account={account}
        walletError={walletError}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        chainId={chainId}
        isCorrectNetwork={isCorrectNetwork}
        switchToSepolia={switchToSepolia}
        getNetworkName={getNetworkName}
        contract={contract}
        fhevm={fhevm}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1" />
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  🔐 FHEScore
                </h1>
                <p className="text-lg text-muted-foreground">
                  Private Credit Score System using FHEVM
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </header>

        {/* Main Content Grid */}
        {isConnected && contract && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* User Dashboard */}
            <Card className="custom-card">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Your account overview</CardDescription>
              </CardHeader>
              <CardContent>
                <UserDashboard
                  contract={contract}
                  userAddress={account}
                  fhevm={fhevm}
                />
              </CardContent>
            </Card>

            {/* Score Display */}
            <Card className="custom-card">
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
                <CardDescription>Your private credit score</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreDisplay
                  contract={contract}
                  contractAddress={getContractAddress(chainId)}
                  userAddress={account}
                  fhevm={fhevm.fhevmInstance}
                />
              </CardContent>
            </Card>

            {/* Activity Submission */}
            <Card className="custom-card">
              <CardHeader>
                <CardTitle>Submit Activity</CardTitle>
                <CardDescription>Add new financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitySubmission
                  contract={contract}
                  contractAddress={getContractAddress(chainId)}
                  userAddress={account}
                  fhevm={fhevm}
                />
              </CardContent>
            </Card>

            {/* Verification Panel */}
            <Card className="custom-card">
              <CardHeader>
                <CardTitle>Verification</CardTitle>
                <CardDescription>Verify and manage activities</CardDescription>
              </CardHeader>
              <CardContent>
                <VerificationPanel
                  contract={contract}
                  userAddress={account}
                />
              </CardContent>
            </Card>
          </div>
        )}

          {/* Connection Required Message */}
          {!isConnected && (
            <div className="text-center py-12 animate-fade-in">
              <Card className="custom-card max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="text-6xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Please connect your wallet to start using FHEScore
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fhescore-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;