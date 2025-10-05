// Contract configuration
// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet
  11155111: process.env.REACT_APP_FHESCORE_CONTRACT_ADDRESS || '0x2AD6b1239184aB5132A5A1EcB7EBDE3f111F4019',
  // Zama Devnet
  8009: process.env.REACT_APP_FHESCORE_CONTRACT_ADDRESS,
  // Inco Testnet  
  21097: process.env.REACT_APP_FHESCORE_CONTRACT_ADDRESS,
  // Localhost
  31337: process.env.REACT_APP_FHESCORE_CONTRACT_ADDRESS
};

// Get contract address for current network
export const getContractAddress = (chainId) => {
  const address = CONTRACT_ADDRESSES[chainId];
  if (!address) {
    console.warn(`No contract address configured for chain ID: ${chainId}`);
    return null;
  }
  return address;
};

// Check if contract is deployed on current network
export const isContractDeployed = (chainId) => {
  return !!CONTRACT_ADDRESSES[chainId];
};