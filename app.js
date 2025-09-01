// app.js - Funcionalidades da plataforma
console.log('app.js carregado.');

// Carrega posts do localStorage ou inicializa com mock
const initialPosts = {
  storyweave: [
    { id: 1, content: 'A knight enters a cursed forest...', author: 'Dreamer#1234', category: 'Fantasy', likes: 10, timestamp: '2025-08-29 15:00', edits: [], liked: false },
    { id: 2, content: 'A hacker discovers a hidden code...', author: 'Dreamer#5678', category: 'Sci-Fi', likes: 5, timestamp: '2025-08-29 14:30', edits: [], liked: false },
  ],
  dreams: [
    { id: 1, content: 'I dreamed of rats dancing in the streets...', author: 'Dreamer#9012', category: 'Surreal', likes: 8, timestamp: '2025-08-29 15:05', edits: [], liked: false },
    { id: 2, content: 'I dreamed of flying over an ocean...', author: 'Dreamer#3456', category: 'Inspiration', likes: 12, timestamp: '2025-08-29 14:45', edits: [], liked: false },
  ],
};

// Inicializa mockPosts com validação
let mockPosts = JSON.parse(localStorage.getItem('mockPosts'));
if (!mockPosts || !Array.isArray(mockPosts.storyweave) || !Array.isArray(mockPosts.dreams)) {
  console.log('localStorage corrompido ou vazio. Inicializando com initialPosts.');
  mockPosts = initialPosts;
  localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
}

// Salva posts no localStorage
function savePosts() {
  console.log('Salvando posts no localStorage...');
  try {
    localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
    console.log('Posts salvos com sucesso.');
  } catch (error) {
    console.error('Erro ao salvar posts:', error);
  }
}

// Função para exibir posts no feed
function renderPosts(section, posts) {
  console.log(`Renderizando posts para a seção: ${section}`);
  const feed = document.getElementById(`${section}-feed`);
  if (!feed) {
    console.error(`Feed não encontrado para a seção: ${section}`);
    return;
  }
  if (!Array.isArray(posts)) {
    console.error(`Posts não é um array para a seção ${section}. Reinicializando...`);
    mockPosts[section] = initialPosts[section];
    savePosts();
    posts = mockPosts[section];
  }
  feed.innerHTML = posts
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(post => `
      <div class="post-card" data-section="${section}" data-id="${post.id}">
        <p>${post.content}</p>
        <p class="author">By: ${post.author}</p>
        <p class="category">Category: ${post.category}</p>
        <p class="timestamp">${post.timestamp}</p>
        ${post.edits && post.edits.length > 0 ? `
          <p class="edit-history">Edit History:</p>
          <ul class="edit-history-list">
            ${post.edits.map(edit => `
              <li>Edited by ${edit.editor} at ${edit.timestamp}</li>
            `).join('')}
          </ul>
        ` : ''}
        <div class="actions">
          <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-section="${section}" data-id="${post.id}">
            <i class="fas fa-heart"></i> <span>${post.likes} (+0.2 WEAVE)</span>
          </button>
          <button class="action-btn share-btn" data-section="${section}" data-id="${post.id}">
            <i class="fas fa-share"></i> <span>Share (+0.3 WEAVE)</span>
          </button>
          <button class="action-btn edit-btn" data-section="${section}" data-id="${post.id}">
            <i class="fas fa-edit"></i> <span>Edit</span>
          </button>
        </div>
        <div class="edit-form" style="display: none;">
          <textarea class="edit-input" placeholder="Edit the post...">${post.content}</textarea>
          <button class="action-btn save-edit-btn" data-section="${section}" data-id="${post.id}">Save Edit</button>
        </div>
      </div>
    `).join('');
  console.log(`Posts renderizados para ${section}:`, posts);
}

// Função para postar história
function postStory() {
  console.log('Botão post-story-btn clicado.');
  const input = document.getElementById('storyweave-input');
  const category = document.getElementById('storyweave-category');
  if (!input || !category) {
    console.error('Elementos de input ou categoria não encontrados na página StoryWeave.');
    alert('Erro: Elementos do formulário não encontrados. Verifique a console (F12).');
    return;
  }
  const content = input.value.trim();
  if (!content) {
    console.log('Conteúdo vazio. Cancelando postagem.');
    alert('Please enter a story.');
    return;
  }
  try {
    console.log('Postando história:', content);
    mockPosts.storyweave.push({
      id: mockPosts.storyweave.length + 1,
      content,
      author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
      category: category.value,
      likes: 0,
      liked: false,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      edits: [],
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
  } catch (error) {
    console.error('Erro ao postar história:', error);
    alert('Erro ao postar história. Verifique a console (F12) para detalhes.');
  }
}

// Função para postar sonho
function postDream() {
  console.log('Botão post-dream-btn clicado.');
  const input = document.getElementById('dreams-input');
  const category = document.getElementById('dreams-category');
  if (!input || !category) {
    console.error('Elementos de input ou categoria não encontrados na página Dreams.');
    alert('Erro: Elementos do formulário não encontrados. Verifique a console (F12).');
    return;
  }
  const content = input.value.trim();
  if (!content) {
    console.log('Conteúdo vazio. Cancelando postagem.');
    alert('Please enter a dream.');
    return;
  }
  try {
    console.log('Postando sonho:', content);
    mockPosts.dreams.push({
      id: mockPosts.dreams.length + 1,
      content,
      author: `Dreamer#${Math.floor(Math.random() * 10000)}`,
      category: category.value,
      likes: 0,
      liked: false,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      edits: [],
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
  } catch (error) {
    console.error('Erro ao postar sonho:', error);
    alert('Erro ao postar sonho. Verifique a console (F12) para detalhes.');
  }
}

// Função para editar post
function editPost(section, id) {
  console.log('Botão edit-btn clicado:', section, id);
  const post = mockPosts[section].find(p => p.id === parseInt(id));
  if (!post) {
    console.error('Post não encontrado:', section, id);
    return;
  }
  const postCard = document.querySelector(`.post-card[data-section="${section}"][data-id="${id}"]`);
  const editForm = postCard.querySelector('.edit-form');
  const editInput = postCard.querySelector('.edit-input');
  if (!editForm || !editInput) {
    console.error('Formulário de edição não encontrado.');
    return;
  }
  editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
}

// Função para salvar edição
function saveEdit(section, id) {
  console.log('Botão save-edit-btn clicado:', section, id);
  const post = mockPosts[section].find(p => p.id === parseInt(id));
  if (!post) {
    console.error('Post não encontrado:', section, id);
    return;
  }
  const postCard = document.querySelector(`.post-card[data-section="${section}"][data-id="${id}"]`);
  const editInput = postCard.querySelector('.edit-input');
  if (!editInput) {
    console.error('Input de edição não encontrado.');
    return;
  }
  const newContent = editInput.value.trim();
  if (!newContent) {
    console.log('Conteúdo vazio. Cancelando edição.');
    alert('Please enter content for the edit.');
    return;
  }
  try {
    post.edits.push({
      editor: `Dreamer#${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    post.content = newContent;
    siteWeaveBalance += 0.3; // Recompensa por edição
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.3 WEAVE for editing a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    renderPosts(section, mockPosts[section]);
    console.log('Post editado com sucesso. Saldo WEAVE:', siteWeaveBalance);
    alert('Post edited! Earned 0.3 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    alert('Erro ao salvar edição. Verifique a console (F12) para detalhes.');
  }
}

// Função para curtir
function likePost(section, id) {
  console.log('Botão like-btn clicado:', section, id);
  const post = mockPosts[section].find(p => p.id === parseInt(id));
  if (!post) {
    console.error('Post não encontrado:', section, id);
    return;
  }
  if (!post.liked) {
    post.likes += 1;
    post.liked = true;
    siteWeaveBalance += 0.2;
    savePosts();
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Gained 0.2 WEAVE for liking a post on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    console.log('Post curtido. Saldo WEAVE:', siteWeaveBalance);
    alert('Liked! Earned 0.2 WEAVE (mock). Note: Mainnet actions cost MATIC.');
  } else {
    console.log('Post já curtido.');
  }
  renderPosts(section, mockPosts[section]);
}

// Função para compartilhar
function sharePost(section, id) {
  console.log('Botão share-btn clicado:', section, id);
  const post = mockPosts[section].find(p => p.id === parseInt(id));
  if (!post) {
    console.error('Post não encontrado:', section, id);
    return;
  }
  try {
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
  } catch (error) {
    console.error('Erro ao compartilhar post:', error);
    alert('Erro ao compartilhar post. Verifique a console (F12) para detalhes.');
  }
}

// Função para solicitar saque
function requestWithdraw() {
  console.log('Botão withdraw-btn clicado.');
  if (siteWeaveBalance < 400) {
    console.log('Saldo insuficiente para saque:', siteWeaveBalance);
    alert('You need at least 400 WEAVE to withdraw to MetaMask.');
    return;
  }
  try {
    const withdrawalAmount = siteWeaveBalance;
    alert(`Withdrawal of ${withdrawalAmount} WEAVE to MetaMask requested (mock). Note: Mainnet actions cost MATIC.`);
    siteWeaveBalance = 0;
    updateWallet();
    const history = document.getElementById('transaction-history');
    if (history) {
      history.innerHTML += `<li>Requested withdrawal of ${withdrawalAmount} WEAVE to MetaMask on ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</li>`;
    }
    console.log('Saque solicitado. Saldo WEAVE resetado:', siteWeaveBalance);
  } catch (error) {
    console.error('Erro ao solicitar saque:', error);
    alert('Erro ao solicitar saque. Verifique a console (F12) para detalhes.');
  }
}

// Função para stake
function stakeWeave() {
  console.log('Botão stake-btn clicado.');
  alert('Staking feature coming soon! Note: Mainnet actions cost MATIC.');
}

// Inicializar eventos e feeds
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded disparado. Inicializando app.js...');
  // Força renderização inicial para garantir que posts apareçam em todos os dispositivos
  if (document.getElementById('storyweave-feed')) {
    console.log('Renderizando feed StoryWeave...');
    renderPosts('storyweave', mockPosts.storyweave);
  }
  if (document.getElementById('dreams-feed')) {
    console.log('Renderizando feed Dreams...');
    renderPosts('dreams', mockPosts.dreams);
  }
  // Atualiza saldo apenas se na página wallet.html
  if (document.getElementById('weave-balance')) {
    console.log('Atualizando saldo na página Wallet...');
    try {
      updateWallet();
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  }

  const postStoryBtn = document.getElementById('post-story-btn');
  if (postStoryBtn) {
    console.log('Associando evento ao botão post-story-btn');
    postStoryBtn.addEventListener('click', () => {
      console.log('Evento de clique no post-story-btn disparado.');
      postStory();
    });
  } else {
    console.log('Botão post-story-btn não encontrado. Verifique se está na página StoryWeave.');
  }

  const postDreamBtn = document.getElementById('post-dream-btn');
  if (postDreamBtn) {
    console.log('Associando evento ao botão post-dream-btn');
    postDreamBtn.addEventListener('click', () => {
      console.log('Evento de clique no post-dream-btn disparado.');
      postDream();
    });
  } else {
    console.log('Botão post-dream-btn não encontrado. Verifique se está na página Dreams.');
  }

  const withdrawBtn = document.getElementById('withdraw-btn');
  if (withdrawBtn) {
    console.log('Associando evento ao botão withdraw-btn');
    withdrawBtn.addEventListener('click', () => {
      console.log('Evento de clique no withdraw-btn disparado.');
      requestWithdraw();
    });
  } else {
    console.log('Botão withdraw-btn não encontrado. Verifique se está na página Wallet.');
  }

  const stakeBtn = document.getElementById('stake-btn');
  if (stakeBtn) {
    console.log('Associando evento ao botão stake-btn');
    stakeBtn.addEventListener('click', () => {
      console.log('Evento de clique no stake-btn disparado.');
      stakeWeave();
    });
  } else {
    console.log('Botão stake-btn não encontrado. Verifique se está na página Wallet.');
  }

  document.addEventListener('click', (event) => {
    console.log('Evento de clique global disparado:', event.target);
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
    if (event.target.closest('.edit-btn')) {
      const btn = event.target.closest('.edit-btn');
      const section = btn.dataset.section;
      const id = btn.dataset.id;
      console.log('Clique no botão de editar:', section, id);
      editPost(section, id);
    }
    if (event.target.closest('.save-edit-btn')) {
      const btn = event.target.closest('.save-edit-btn');
      const section = btn.dataset.section;
      const id = btn.dataset.id;
      console.log('Clique no botão de salvar edição:', section, id);
      saveEdit(section, id);
    }
  });
});