import { useState, useEffect, useCallback } from 'react';
import { createInstance, initSDK } from '@zama-fhe/relayer-sdk/web';

// FHEVM Network Configurations
const FHEVM_NETWORKS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    publicKeyUrl: 'hhttps://relayer.testnet.zama.cloud/fhe-keys',
    relayerUrl: 'https://relayer.testnet.zama.cloud',
    aclContractAddress: '0x687820221192C5B662b25367F70076A37bc79b6c',
    kmsContractAddress: '0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC',
    inputVerifierContractAddress: '0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4',
    verifyingContractAddressDecryption: '0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1',
    verifyingContractAddressInputVerification: '0x7048C39f048125eDa9d678AEbaDfB22F7900a29F',
    gatewayChainId: 55815,
    network: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.public.blastapi.io'
  },
  zamaDevnet: {
    chainId: 8009,
    name: 'Zama Devnet',
    publicKeyUrl: 'https://devnet.zama.ai/fhe-keys',
    relayerUrl: 'https://devnet.zama.ai/relayer'
  },
  incoTestnet: {
    chainId: 21097,
    name: 'Inco Testnet',
    publicKeyUrl: 'https://testnet.inco.org/fhe-keys',
    relayerUrl: 'https://testnet.inco.org/relayer'
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    publicKeyUrl: 'http://localhost:8080/fhe-keys',
    relayerUrl: 'http://localhost:8080/relayer'
  }
};

export const useFHEVM = () => {
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    const initFHEVM = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Detect current network
        const chainId = window.ethereum ? 
          parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16) : 
          31337; // Default to localhost
        

        
        // Find matching FHEVM network configuration
        const networkConfig = Object.values(FHEVM_NETWORKS).find(
          network => network.chainId === chainId
        );
        
        if (!networkConfig) {
          const supportedNetworks = Object.values(FHEVM_NETWORKS).map(n => `${n.name} (${n.chainId})`).join(', ');
          const errorMessage = `Please switch to a supported FHEVM network. Current: ${chainId}. Supported: ${supportedNetworks}`;
          console.log(`ℹ️ Current network (Chain ID: ${chainId}) does not support FHEVM. Supported networks: ${supportedNetworks}`);
          setError(errorMessage);
          setCurrentNetwork(null);
          setIsLoading(false);
          return;
        }
        
        setCurrentNetwork(networkConfig);
        console.log(`🌐 Initializing FHEVM for ${networkConfig.name} (Chain ID: ${chainId})`);
        
        // Initialize FHEVM instance with network configuration
        let instance;
        
        // Initialize SDK first
        await initSDK();
        
        if (networkConfig.chainId === 11155111) {
          // Use Sepolia configuration with all required contract addresses
          const sepoliaConfig = {
            aclContractAddress: '0x687820221192C5B662b25367F70076A37bc79b6c',
            kmsContractAddress: '0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC',
            inputVerifierContractAddress: '0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4',
            verifyingContractAddressDecryption: '0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1',
            verifyingContractAddressInputVerification: '0x7048C39f048125eDa9d678AEbaDfB22F7900a29F',
            chainId: 11155111,
            gatewayChainId: 55815,
            network: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.public.blastapi.io',
            relayerUrl: 'https://relayer.testnet.zama.cloud',
          };
          
          instance = await createInstance(sepoliaConfig);
        } else {
          // Use custom configuration for other networks
          const instanceConfig = {
            chainId: networkConfig.chainId,
            publicKeyUrl: networkConfig.publicKeyUrl,
            relayerUrl: networkConfig.relayerUrl
          };
          instance = await createInstance(instanceConfig);
        }
        
        setFhevmInstance(instance);
        console.log(`✅ FHEVM instance initialized successfully for ${networkConfig.name}`);
        
      } catch (err) {
        console.error('❌ Failed to initialize FHEVM:', err);
        const userFriendlyMessage = err.message.includes('KMS contract address') 
          ? 'FHEVM initialization failed. Please ensure you are connected to a supported network.'
          : err.message;
        setError(userFriendlyMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initFHEVM();

    // Listen for network changes
    const handleChainChanged = () => {
      console.log('🔄 Network changed, reinitializing FHEVM...');
      initFHEVM();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  /**
   * Encrypt a value for contract input
   * @param {number} value - The value to encrypt
   * @param {string} type - The type of value ('uint32', 'bool', etc.)
   * @param {string} contractAddress - The contract address
   * @param {string} userAddress - The user's address
   * @returns {Object} Encrypted input with handles and proof
   */
  const encryptValue = useCallback(async (value, type, contractAddress, userAddress) => {
    if (!fhevmInstance) {
      throw new Error('FHEVM instance not initialized');
    }

    try {
      // Create encrypted input buffer
      const input = fhevmInstance.createEncryptedInput(contractAddress, userAddress);

      // Add value based on type
      switch (type) {
        case 'uint32':
          input.add32(value);
          break;
        case 'bool':
          input.addBool(value);
          break;
        case 'uint8':
          input.add8(value);
          break;
        case 'uint16':
          input.add16(value);
          break;
        case 'uint64':
          input.add64(value);
          break;
        default:
          throw new Error(`Unsupported type: ${type}`);
      }

      // Encrypt the input
      const encryptedInputs = await input.encrypt();
      
      return encryptedInputs;
    } catch (err) {
      console.error('❌ Encryption failed:', err);
      throw err;
    }
  }, [fhevmInstance]);

  /**
   * Decrypt a value for the user
   * @param {string} ciphertextHandle - The encrypted value handle
   * @param {string} contractAddress - The contract address
   * @param {Object} signer - The ethers signer
   * @returns {number} Decrypted value
   */
  const decryptValue = useCallback(async (ciphertextHandle, contractAddress, signer) => {
    if (!fhevmInstance) {
      throw new Error('FHEVM instance not initialized');
    }

    try {
      // Generate temporary keypair for decryption
      const keypair = fhevmInstance.generateKeypair();
      
      // Get user address
      const userAddress = await signer.getAddress();

      // Create EIP-712 message for authorization
      const eip712Domain = {
        name: 'Authorization token',
        version: '1',
        chainId: await signer.getChainId(),
        verifyingContract: contractAddress,
      };

      const eip712Types = {
        Reencrypt: [
          { name: 'publicKey', type: 'bytes32' },
        ],
      };

      const eip712Message = {
        publicKey: `0x${keypair.publicKey}`,
      };

      // Sign the EIP-712 message
      const signature = await signer.signTypedData(eip712Domain, eip712Types, eip712Message);

      // Perform decryption
      const result = await fhevmInstance.userDecrypt(
        [{ handle: ciphertextHandle, contractAddress }],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        eip712Domain,
        userAddress
      );

      return result[ciphertextHandle];
    } catch (err) {
      console.error('❌ Decryption failed:', err);
      throw err;
    }
  }, [fhevmInstance]);

  /**
   * Generate a keypair for encryption/decryption
   * @returns {Object} Keypair with public and private keys
   */
  const generateKeypair = useCallback(() => {
    if (!fhevmInstance) {
      throw new Error('FHEVM instance not initialized');
    }
    
    return fhevmInstance.generateKeypair();
  }, [fhevmInstance]);

  return {
    fhevmInstance,
    isLoading,
    error,
    currentNetwork,
    encryptValue,
    decryptValue,
    generateKeypair,
    isReady: !!fhevmInstance && !isLoading && !error,
    supportedNetworks: FHEVM_NETWORKS
  };
};