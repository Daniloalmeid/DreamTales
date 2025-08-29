// wallet.js - Conexão com MetaMask na Polygon Mainnet
let provider;
let signer;
let walletAddress = '';

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Solicita conexão com MetaMask
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      // Configura rede Polygon Mainnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet (137)
      });

      signer = provider.getSigner();
      walletAddress = await signer.getAddress();
      document.getElementById('wallet-address').textContent = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
      document.getElementById('connect-wallet').textContent = 'Connected';
      document.getElementById('connect-wallet').style.background = '#2ecc71';

      // Mock de saldo (substituir por integração com contrato WEAVE)
      document.getElementById('weave-balance').textContent = '10.5 WEAVE';

      // Mock de histórico (substituir por integração com contrato)
      document.getElementById('transaction-history').innerHTML = `
        <li>Gained 0.5 WEAVE for posting a dream on 08/29/2025</li>
        <li>Gained 0.2 WEAVE for liking a story on 08/29/2025</li>
      `;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect MetaMask. Ensure Polygon Mainnet is selected and try again.');
    }
  } else {
    alert('Please install MetaMask to use DreamTales.');
  }
}

document.getElementById('connect-wallet').addEventListener('click', connectWallet);