// wallet.js - Conexão com MetaMask na Polygon Mainnet
let provider = null;
let signer = null;
let walletAddress = '';
let siteWeaveBalance = 0;

async function connectWallet() {
  console.log('Tentando conectar a MetaMask...');
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
    console.log('Carteira conectada:', walletAddress);

    // Atualiza interface
    const addressElement = document.getElementById('wallet-address');
    if (addressElement) {
      addressElement.textContent = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
    }
    const connectButton = document.getElementById('connect-wallet');
    if (connectButton) {
      connectButton.textContent = 'Connected';
      connectButton.classList.add('connected');
    }

    // Mock de saldo inicial
    updateWallet();
    console.log('Conexão bem-sucedida!');
    return true;
  } catch (error) {
    console.error('Falha na conexão com a MetaMask:', error);
    alert('Falha na conexão com a MetaMask. Verifique a console (F12) para detalhes e tente novamente. Certifique-se de que a Polygon Mainnet está selecionada e você tem MATIC para gas.');
    return false;
  }
}

// Persiste conexão entre páginas
if (window.ethereum) {
  window.ethereum.on('accountsChanged', async (accounts) => {
    console.log('Contas alteradas:', accounts);
    if (accounts.length === 0) {
      walletAddress = '';
      siteWeaveBalance = 0;
      const addressElement = document.getElementById('wallet-address');
      if (addressElement) {
        addressElement.textContent = 'Not connected';
      }
      const connectButton = document.getElementById('connect-wallet');
      if (connectButton) {
        connectButton.textContent = 'Connect MetaMask';
        connectButton.classList.remove('connected');
      }
      updateWallet();
      console.log('Contas desconectadas.');
    } else {
      await connectWallet();
    }
  });

  window.ethereum.on('chainChanged', () => {
    console.log('Rede alterada. Recarregando página...');
    window.location.reload();
  });
}

// Atualiza interface da Wallet
function updateWallet() {
  const balanceElement = document.getElementById('weave-balance');
  const withdrawBtn = document.getElementById('withdraw-btn');
  const stakedBalance = document.getElementById('staked-balance');
  if (balanceElement) {
    balanceElement.textContent = `${siteWeaveBalance.toFixed(1)} WEAVE`;
  }
  if (withdrawBtn) {
    if (siteWeaveBalance >= 400) {
      withdrawBtn.disabled = false;
      withdrawBtn.style.background = '#4f46e5';
    } else {
      withdrawBtn.disabled = true;
      withdrawBtn.style.background = '#d1d5db';
    }
  }
  if (stakedBalance) {
    stakedBalance.textContent = '0 WEAVE Staked';
  }
}

document.getElementById('connect-wallet').addEventListener('click', connectWallet);
</xaiArtifact>
- **Alterações**:  
  - Adiciona mais console.logs para depuração detalhada.  
  - Melhor tratamento de erros, como rede não adicionada.  
  - Persistência entre páginas com eventos `accountsChanged` e `chainChanged`.  
  - Atualiza o botão para "Connected" apenas após sucesso.  

#### 5. `app.js` (Script para Funcionalidades - Otimizado)
