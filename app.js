// app.js - Funcionalidades da plataforma
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
  
  // Função para alternar abas
  function switchTab(event) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(event.target.dataset.tab).classList.add('active');
  }
  
  // Função para exibir posts no feed
  function renderPosts(section, posts) {
    const feed = document.getElementById(`${section}-feed`);
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
  
  // Função para postar (mock, substituir por integração com IPFS/contrato)
  function postStory() {
    const content = document.getElementById('storyweave-input').value;
    const category = document.getElementById('storyweave-category').value;
    if (content && walletAddress) {
      mockPosts.storyweave.push({
        id: mockPosts.storyweave.length + 1,
        content,
        author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
        category,
        likes: 0,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
      renderPosts('storyweave', mockPosts.storyweave);
      document.getElementById('storyweave-input').value = '';
      alert('Story posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
    } else {
      alert('Please enter a story and connect your wallet.');
    }
  }
  
  function postDream() {
    const content = document.getElementById('dreams-input').value;
    const category = document.getElementById('dreams-category').value;
    if (content && walletAddress) {
      mockPosts.dreams.push({
        id: mockPosts.dreams.length + 1,
        content,
        author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
        category,
        likes: 0,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
      renderPosts('dreams', mockPosts.dreams);
      document.getElementById('dreams-input').value = '';
      alert('Dream posted! Earned 0.5 WEAVE (mock). Note: Mainnet actions cost MATIC.');
    } else {
      alert('Please enter a dream and connect your wallet.');
    }
  }
  
  // Função para curtir (mock, substituir por integração com contrato)
  function likePost(section, id) {
    if (!walletAddress) {
      alert('Please connect your wallet.');
      return;
    }
    const post = mockPosts[section].find(p => p.id === id);
    post.likes += 1;
    post.liked = true;
    renderPosts(section, mockPosts[section]);
    alert('Liked! Earned 0.2 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  }
  
  // Função para compartilhar (mock, substituir por integração real)
  function sharePost(section, id) {
    if (!walletAddress) {
      alert('Please connect your wallet.');
      return;
    }
    const post = mockPosts[section].find(p => p.id === id);
    const shareUrl = `https://dreamtales.io/post/${section}/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Copied share link: ${shareUrl}. Earned 0.3 WEAVE (mock). Note: Mainnet actions cost MATIC.`);
  }
  
  // Inicializar
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', switchTab));
  renderPosts('storyweave', mockPosts.storyweave);
  renderPosts('dreams', mockPosts.dreams);