import React from 'react';
import { useFHEVM } from '../hooks/useFHEVM';

const NetworkSwitcher = () => {
  const { currentNetwork, error } = useFHEVM();

  // Styles
  const styles = {
    networkSwitcher: {
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0'
    },
    networkSwitcherError: {
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      background: '#fff3e0',
      border: '1px solid #ff9800'
    },
    currentNetwork: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 15px',
      background: '#e8f5e8',
      border: '1px solid #4caf50',
      borderRadius: '6px'
    },
    networkIndicator: {
      fontSize: '18px'
    },
    networkName: {
      fontWeight: 'bold',
      color: '#2e7d32'
    },
    networkStatus: {
      color: '#4caf50',
      fontSize: '14px'
    },
    networkError: {
      color: '#bf360c'
    },
    networkErrorTitle: {
      color: '#e65100',
      margin: '0 0 15px 0'
    },
    networkErrorText: {
      color: '#bf360c',
      marginBottom: '20px'
    },
    networkOptions: {
      display: 'grid',
      gap: '15px',
      marginBottom: '25px'
    },
    networkButton: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      border: '2px solid #ff9800',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    networkButtonDisabled: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      border: '2px solid #ff9800',
      borderRadius: '8px',
      background: 'white',
      cursor: 'not-allowed',
      transition: 'all 0.2s',
      opacity: 0.6
    },
    networkInfoStrong: {
      display: 'block',
      color: '#e65100'
    },
    networkInfoSmall: {
      color: '#bf360c'
    },
    networkHelp: {
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '6px',
      marginTop: '20px'
    },
    networkHelpTitle: {
      margin: '0 0 10px 0',
      color: '#424242'
    },
    networkHelpList: {
      margin: '10px 0',
      paddingLeft: '20px'
    },
    networkHelpListItem: {
      margin: '5px 0',
      color: '#616161'
    },
    networkHelpText: {
      margin: '15px 0 0 0',
      fontStyle: 'italic',
      color: '#757575'
    }
  };



  if (!error && currentNetwork) {
    return (
      <div style={styles.networkSwitcher}>
        <div style={styles.currentNetwork}>
          <span style={styles.networkIndicator}>🌐</span>
          <span style={styles.networkName}>{currentNetwork.name}</span>
          <span style={styles.networkStatus}>✅ FHEVM Ready</span>
        </div>
      </div>
    );
  }

  // Hide the FHEVM Network Required card - return null instead of showing error
  return null;
};

export default NetworkSwitcher;