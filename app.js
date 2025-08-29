// app.js - Funcionalidades da plataforma
// Carrega posts do localStorage ou inicializa com mock
const initialPosts = {
    storyweave: [
      { id: 1, content: 'A knight enters a cursed forest...', author: 'Dreamer#1234', category: 'Fantasy', likes: 10, timestamp: '2025-08-29 15:00' },
      { id: 2, content: 'A hacker discovers a hidden code...', author: 'Dreamer#5678', category: 'Sci-Fi', likes: 5, timestamp: '2025-08-29 14:30' },
    ],
    dreams: [
      { id: 1, content: 'I dreamed of rats dancing in the streets...', author: 'Dreamer#9012', category: 'Surreal', likes: 8, timestamp: '2025-08-29 15:05' },
      { id: 2, content: 'I dreamed of flying over an ocean...', author: 'Dreamer#3456', category: 'Inspiration', likes: 12, timestamp: '2025-08-29 14:45' },
    ],
  };
  const mockPosts = JSON.parse(localStorage.getItem('mockPosts')) || initialPosts;
  
  // Salva posts no localStorage
  function savePosts() {
    localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
  }
  
  // Função para exibir posts no feed
  function renderPosts(section, posts) {
    const feed = document.getElementById(`${section}-feed`);
    if (feed) {
      feed.innerHTML = posts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(post => `
          <div class="post-card">
            <p>${post.content}</p>
            <p class="author">By: ${post.author}</p>
            <p class="category">Category: ${post.category}</p>
            <p class="timestamp">${post.timestamp}</p>
            <div class="actions">
              <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-section="${section}" data-id="${post.id}">
                <i class="fas fa-heart"></i> <span>${post.likes} (+0.2 WEAVE)</span>
              </button>
              <button class="action-btn share-btn" data-section="${section}" data-id="${post.id}">
                <i class="fas fa-share"></i> <span>Share (+0.3 WEAVE)</span>
              </button>
            </div>
          </div>
        `).join('');
    }
  }
  
  // Função para postar história
  async function postStory() {
    console.log('Tentando postar história...');
    if (!walletAddress) {
      console.log('Carteira não conectada. Solicitando conexão...');
      const connected = await connectWallet();
      if (!connected) {
        console.error('Falha na conexão da carteira.');
        return;
      }
    }
    const input = document.getElementById('storyweave-input');
    const category = document.getElementById('storyweave-category');
    if (!input || !category) {
      console.error('Elementos de input ou categoria não encontrados.');
      return;
    }
    const content = input.value.trim();
    if (!content) {
      console.log('Conteúdo vazio. Cancelando postagem.');
      alert('Please enter a story.');
      return;
    }
    console.log('Postando história:', content);
    mockPosts.storyweave.push({
      id: mockPosts.storyweave.length + 1,
      content,
      author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
      category: category.value,
      likes: 0,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    siteWeaveBalance += 0.5;
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.5 WEAVE for posting a story on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    renderPosts('storyweave', mockPosts.storyweave);
    input.value = '';
    console.log('História postada com sucesso. Saldo WEAVE:', siteWeaveBalance);
    alert('Story posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  }
  
  // Função para postar sonho
  async function postDream() {
    console.log('Tentando postar sonho...');
    if (!walletAddress) {
      console.log('Carteira não conectada. Solicitando conexão...');
      const connected = await connectWallet();
      if (!connected) {
        console.error('Falha na conexão da carteira.');
        return;
      }
    }
    const input = document.getElementById('dreams-input');
    const category = document.getElementById('dreams-category');
    if (!input || !category) {
      console.error('Elementos de input ou categoria não encontrados.');
      return;
    }
    const content = input.value.trim();
    if (!content) {
      console.log('Conteúdo vazio. Cancelando postagem.');
      alert('Please enter a dream.');
      return;
    }
    console.log('Postando sonho:', content);
    mockPosts.dreams.push({
      id: mockPosts.dreams.length + 1,
      content,
      author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
      category: category.value,
      likes: 0,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    siteWeaveBalance += 0.5;
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.5 WEAVE for posting a dream on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    renderPosts('dreams', mockPosts.dreams);
    input.value = '';
    console.log('Sonho postado com sucesso. Saldo WEAVE:', siteWeaveBalance);
    alert('Dream posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  }
  
  // Função para curtir
  async function likePost(section, id) {
    console.log('Tentando curtir post:', section, id);
    if (!walletAddress) {
      console.log('Carteira não conectada. Solicitando conexão...');
      const connected = await connectWallet();
      if (!connected) {
        console.error('Falha na conexão da carteira.');
        return;
      }
    }
    const post = mockPosts[section].find(p => p.id === parseInt(id));
    if (!post) {
      console.error('Post não encontrado:', section, id);
      return;
    }
    post.likes += 1;
    post.liked = true;
    siteWeaveBalance += 0.2;
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.2 WEAVE for liking a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    renderPosts(section, mockPosts[section]);
    console.log('Post curtido. Saldo WEAVE:', siteWeaveBalance);
    alert('Liked! Earned 0.2 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  }
  
  // Função para compartilhar
  async function sharePost(section, id) {
    console.log('Tentando compartilhar post:', section, id);
    if (!walletAddress) {
      console.log('Carteira não conectada. Solicitando conexão...');
      const connected = await connectWallet();
      if (!connected) {
        console.error('Falha na conexão da carteira.');
        return;
      }
    }
    const post = mockPosts[section].find(p => p.id === parseInt(id));
    if (!post) {
      console.error('Post não encontrado:', section, id);
      return;
    }
    const shareUrl = `https://dreamtales.io/post/${section}/${id}`;
    navigator.clipboard.writeText(shareUrl);
    siteWeaveBalance += 0.3;
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.3 WEAVE for sharing a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    console.log('Post compartilhado. Saldo WEAVE:', siteWeaveBalance);
    alert(`Copied share link: ${shareUrl}. Earned 0.3 WEAVE (mock). Note: Mainnet actions cost MATIC.`);
  }
  
  // Função para solicitar saque
  function requestWithdraw() {
    console.log('Tentando sacar WEAVE...');
    if (siteWeaveBalance < 400) {
      console.log('Saldo insuficiente para saque:', siteWeaveBalance);
      alert('You need at least 400 WEAVE to withdraw to MetaMask.');
      return;
    }
    alert(`Withdrawal of ${siteWeaveBalance} WEAVE to MetaMask requested (mock). Note: Mainnet actions cost MATIC.`);
    siteWeaveBalance = 0;
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Requested withdrawal of ${siteWeaveBalance} WEAVE to MetaMask on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    console.log('Saque solicitado. Saldo WEAVE resetado:', siteWeaveBalance);
  }
  
  // Função para stake
  function stakeWeave() {
    console.log('Tentando fazer stake...');
    alert('Staking feature coming soon! Note: Mainnet actions cost MATIC.');
  }
  
  // Inicializar eventos e feeds
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando app.js...');
    renderPosts('storyweave', mockPosts.storyweave);
    renderPosts('dreams', mockPosts.dreams);
    // Atualiza saldo apenas se na página wallet.html
    if (document.getElementById('weave-balance')) {
      updateWallet();
    }
  
    const postStoryBtn = document.getElementById('post-story-btn');
    if (postStoryBtn) {
      console.log('Associando evento ao botão post-story-btn');
      postStoryBtn.addEventListener('click', postStory);
    } else {
      console.log('Botão post-story-btn não encontrado. Ignorando.');
    }
  
    const postDreamBtn = document.getElementById('post-dream-btn');
    if (postDreamBtn) {
      console.log('Associando evento ao botão post-dream-btn');
      postDreamBtn.addEventListener('click', postDream);
    } else {
      console.log('Botão post-dream-btn não encontrado. Ignorando.');
    }
  
    const withdrawBtn = document.getElementById('withdraw-btn');
    if (withdrawBtn) {
      console.log('Associando evento ao botão withdraw-btn');
      withdrawBtn.addEventListener('click', requestWithdraw);
    } else {
      console.log('Botão withdraw-btn não encontrado. Ignorando.');
    }
  
    const stakeBtn = document.getElementById('stake-btn');
    if (stakeBtn) {
      console.log('Associando evento ao botão stake-btn');
      stakeBtn.addEventListener('click', stakeWeave);
    } else {
      console.log('Botão stake-btn não encontrado. Ignorando.');
    }
  
    document.addEventListener('click', (event) => {
      if (event.target.closest('.like-btn')) {
        const btn = event.target.closest('.like-btn');
        const section = btn.dataset.section;
        const id = btn.dataset.id;
        console.log('Clique no botão de curtir:', section, id);
        likePost(section, id);
      }
      if (event.target.closest('.share-btn')) {
        const btn = event.target.closest('.share-btn');
        const section = btn.dataset.section;
        const id = btn.dataset.id;
        console.log('Clique no botão de compartilhar:', section, id);
        sharePost(section, id);
      }
    });
  });