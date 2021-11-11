// Check for MetaMask wallet browser extension
declare let window: any;
function hasEthereum () {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

export { hasEthereum }