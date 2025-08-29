// wallet.js - Conexão com MetaMask na Polygon Mainnet
let provider = null;
let signer = null;
let walletAddress = '';
let siteWeaveBalance = parseFloat(localStorage.getItem('siteWeaveBalance') || '0');

async function connectWallet() {
  console.log('Tentando conectar a MetaMask...');
  if (typeof ethers === 'undefined') {
    console.error('ethers.js not loaded. Check the script src in HTML.');
    alert('Failed to load ethers.js library. Check your internet connection or the CDN.');
    return false;
  }
  if (!window.ethereum) {
    console.error('MetaMask não detectada. Instale a extensão.');
    alert('MetaMask não instalada. Por favor, instale a extensão para usar o DreamTales.');
    return false;
  }

  try {
    console.log('Inicializando provider...');
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Verifica rede
    const network = await provider.getNetwork();
    console.log('Rede atual:', network.name, '(chainId:', network.chainId, ')');
    if (network.chainId !== 137) {
      console.log('Alternando para Polygon Mainnet...');
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
        console.log('Rede alternada com sucesso.');
      } catch (switchError) {
        console.error('Erro ao alternar rede:', switchError);
        if (switchError.code === 4902) {
          console.log('Adicionando Polygon Mainnet...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com'],
              blockExplorerUrls: ['https://polygonscan.com'],
            }],
          });
          console.log('Rede adicionada. Tente conectar novamente.');
          alert('Rede Polygon Mainnet adicionada. Clique em "Connect MetaMask" novamente.');
          return false;
        } else {
          alert('Erro ao alternar para Polygon Mainnet. Verifique a MetaMask.');
          return false;
        }
      }
    }

    // Conecta carteira
    console.log('Solicitando contas...');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      console.error('Nenhuma conta retornada pela MetaMask.');
      alert('Nenhuma conta selecionada na MetaMask. Por favor, aprove a conexão.');
      return false;
    }
    signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    localStorage.setItem('walletAddress', walletAddress);
    console.log('Carteira conectada:', walletAddress);

    // Atualiza interface
    updateWalletInterface();
    // Carrega saldo do localStorage
    siteWeaveBalance = parseFloat(localStorage.getItem('siteWeaveBalance') || '0');
    updateWallet();
    console.log('Conexão bem-sucedida!');
    return true;
  } catch (error) {
    console.error('Falha na conexão com a MetaMask:', error);
    alert('Falha na conexão com a MetaMask. Verifique a console (F12) para detalhes e tente novamente. Certifique-se de que a Polygon Mainnet está selecionada e você tem MATIC para gas.');
    return false;
  }
}

// Verifica conexão existente ao carregar a página
async function checkExistingConnection() {
  console.log('Verificando conexão existente com MetaMask...');
  if (typeof ethers === 'undefined' || !window.ethereum) {
    console.log('ethers.js ou MetaMask não disponíveis.');
    localStorage.removeItem('walletAddress');
    updateWalletInterface();
    return;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const network = await provider.getNetwork();
    console.log('Contas detectadas:', accounts, 'Rede:', network.name);
    if (accounts.length > 0 && network.chainId === 137) {
      signer = provider.getSigner();
      walletAddress = await signer.getAddress();
      localStorage.setItem('walletAddress', walletAddress);
      console.log('Conexão existente confirmada:', walletAddress);
      updateWalletInterface();
      siteWeaveBalance = parseFloat(localStorage.getItem('siteWeaveBalance') || '0');
      updateWallet();
    } else {
      console.log('Nenhuma conexão válida encontrada.');
      walletAddress = '';
      localStorage.removeItem('walletAddress');
      updateWalletInterface();
    }
  } catch (error) {
    console.error('Erro ao verificar conexão existente:', error);
    walletAddress = '';
    localStorage.removeItem('walletAddress');
    updateWalletInterface();
  }
}

// Atualiza interface da carteira
function updateWalletInterface() {
  const addressElement = document.getElementById('wallet-address');
  const connectButton = document.getElementById('connect-wallet');
  if (addressElement) {
    addressElement.textContent = walletAddress ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Not connected';
  }
  if (connectButton) {
    connectButton.textContent = walletAddress ? 'Connected' : 'Connect MetaMask';
    if (walletAddress) {
      connectButton.classList.add('connected');
    } else {
      connectButton.classList.remove('connected');
    }
  }
}

// Atualiza interface do saldo
function updateWallet() {
  localStorage.setItem('siteWeaveBalance', siteWeaveBalance.toString());
  const balanceElement = document.getElementById('weave-balance');
  const withdrawBtn = document.getElementById('withdraw-btn');
  const stakedBalance = document.getElementById('staked-balance');
  if (balanceElement) {
    balanceElement.textContent = `${siteWeaveBalance.toFixed(1)} WEAVE`;
  }
  if (withdrawBtn) {
    withdrawBtn.disabled = siteWeaveBalance < 400;
    withdrawBtn.style.background = siteWeaveBalance >= 400 ? '#4f46e5' : '#d1d5db';
  }
  if (stakedBalance) {
    stakedBalance.textContent = '0 WEAVE Staked';
  }
}

// Persiste conexão entre páginas
if (window.ethereum) {
  window.ethereum.on('accountsChanged', async (accounts) => {
    console.log('Contas alteradas:', accounts);
    if (accounts.length === 0) {
      walletAddress = '';
      localStorage.removeItem('walletAddress');
      siteWeaveBalance = 0;
      localStorage.setItem('siteWeaveBalance', '0');
      updateWalletInterface();
      updateWallet();
      console.log('Contas desconectadas.');
    } else {
      await connectWallet();
    }
  });

  window.ethereum.on('chainChanged', () => {
    console.log('Rede alterada. Recarregando página...');
    walletAddress = '';
    localStorage.removeItem('walletAddress');
    window.location.reload();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando wallet.js...');
  const connectButton = document.getElementById('connect-wallet');
  if (connectButton) {
    connectButton.addEventListener('click', connectWallet);
  }
  // Adiciona delay para garantir que o DOM esteja carregado
  setTimeout(checkExistingConnection, 100);
});