// app.js - Funcionalidades da plataforma
let siteWeaveBalance = 0; // Saldo na wallet do site
let walletAddress = ''; // Endereço MetaMask

// Mock de posts (substituir por integração com IPFS e contrato WEAVE)
const mockPosts = {
  storyweave: [
    { id: 1, content: 'A knight enters a cursed forest...', author: 'Dreamer#1234', category: 'Fantasy', likes: 10, timestamp: '2025-08-29 15:00' },
    { id: 2, content: 'A hacker discovers a hidden code...', author: 'Dreamer#5678', category: 'Sci-Fi', likes: 5, timestamp: '2025-08-29 14:30' },
  ],
  dreams: [
    { id: 1, content: 'I dreamed of rats dancing in the streets...', author: 'Dreamer#9012', category: 'Surreal', likes: 8, timestamp: '2025-08-29 15:05' },
    { id: 2, content: 'I dreamed of flying over an ocean...', author: 'Dreamer#3456', category: 'Inspiration', likes: 12, timestamp: '2025-08-29 14:45' },
  ],
};

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
            <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="likePost('${section}', ${post.id})">
              <i class="fas fa-heart"></i> <span>${post.likes} (+0.2 WEAVE)</span>
            </button>
            <button class="action-btn share-btn" onclick="sharePost('${section}', ${post.id})">
              <i class="fas fa-share"></i> <span>Share (+0.3 WEAVE)</span>
            </button>
          </div>
        </div>
      `).join('');
  }
}

// Função para postar história
async function postStory() {
  if (!walletAddress) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const input = document.getElementById('storyweave-input');
  const category = document.getElementById('storyweave-category');
  if (!input || !category) return;
  const content = input.value;
  if (!content) {
    alert('Please enter a story.');
    return;
  }
  mockPosts.storyweave.push({
    id: mockPosts.storyweave.length + 1,
    content,
    author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
    category: category.value,
    likes: 0,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
  });
  siteWeaveBalance += 0.5;
  updateWallet();
  const history = document.getElementById('transaction-history');
  if (history) {
    history.innerHTML += `<li>Gained 0.5 WEAVE for posting a story on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
  }
  renderPosts('storyweave', mockPosts.storyweave);
  input.value = '';
  alert('Story posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
}

// Função para postar sonho
async function postDream() {
  if (!walletAddress) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const input = document.getElementById('dreams-input');
  const category = document.getElementById('dreams-category');
  if (!input || !category) return;
  const content = input.value;
  if (!content) {
    alert('Please enter a dream.');
    return;
  }
  mockPosts.dreams.push({
    id: mockPosts.dreams.length + 1,
    content,
    author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
    category: category.value,
    likes: 0,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
  });
  siteWeaveBalance += 0.5;
  updateWallet();
  const history = document.getElementById('transaction-history');
  if (history) {
    history.innerHTML += `<li>Gained 0.5 WEAVE for posting a dream on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
  }
  renderPosts('dreams', mockPosts.dreams);
  input.value = '';
  alert('Dream posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
}

// Função para curtir
async function likePost(section, id) {
  if (!walletAddress) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const post = mockPosts[section].find(p => p.id === id);
  post.likes += 1;
  post.liked = true;
  siteWeaveBalance += 0.2;
  updateWallet();
  const history = document.getElementById('transaction-history');
  if (history) {
    history.innerHTML += `<li>Gained 0.2 WEAVE for liking a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
  }
  renderPosts(section, mockPosts[section]);
  alert('Liked! Earned 0.2 WEAVE (mock). Note: Mainnet actions cost MATIC.');
}

// Função para compartilhar
async function sharePost(section, id) {
  if (!walletAddress) {
    const connected = await connectWallet();
    if (!connected) return;
  }
  const post = mockPosts[section].find(p => p.id === id);
  const shareUrl = `https://dreamtales.io/post/${section}/${id}`;
  navigator.clipboard.writeText(shareUrl);
  siteWeaveBalance += 0.3;
  updateWallet();
  const history = document.getElementById('transaction-history');
  if (history) {
    history.innerHTML += `<li>Gained 0.3 WEAVE for sharing a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
  }
  alert(`Copied share link: ${shareUrl}. Earned 0.3 WEAVE (mock). Note: Mainnet actions cost MATIC.`);
}

// Função para solicitar saque
function requestWithdraw() {
  if (siteWeaveBalance < 400) {
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
}

// Função para stake (mock)
function stakeWeave() {
  alert('Staking feature coming soon! Note: Mainnet actions cost MATIC.');
}

// Inicializar
renderPosts('storyweave', mockPosts.storyweave);
renderPosts('dreams', mockPosts.dreams);
updateWallet();