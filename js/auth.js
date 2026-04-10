// ══════════════════════════════════════════
//  PNCNS — AUTHENTIFICATION
// ══════════════════════════════════════════

const USERS = {
  admin: {
    password: 'admin123',
    name: 'DIAKITE BADRA Ali',
    role: 'Expert SI Santé & Plateformes Digitales',
    initials: 'DB',
    canEdit: true
  },
  analyste: {
    password: 'analyse123',
    name: 'Analyste PNCNS',
    role: 'Analyste financier',
    initials: 'AN',
    canEdit: false
  },
  saisie: {
    password: 'saisie123',
    name: 'Agent de saisie',
    role: 'Agent de saisie de données',
    initials: 'AS',
    canEdit: true
  }
};

let currentUser = null;

function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');

  const user = USERS[username];
  if (user && user.password === password) {
    currentUser = { ...user, username };
    sessionStorage.setItem('pncns_user', JSON.stringify(currentUser));
    errorEl.classList.add('hidden');
    showApp();
  } else {
    errorEl.classList.remove('hidden');
    document.getElementById('password').value = '';
  }
}

function fillDemo(u, p) {
  document.getElementById('username').value = u;
  document.getElementById('password').value = p;
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-role').textContent = currentUser.role;
  document.getElementById('user-avatar').textContent = currentUser.initials;

  // Hide saisie for read-only users
  if (!currentUser.canEdit) {
    const navSaisie = document.getElementById('nav-saisie');
    if (navSaisie) navSaisie.style.display = 'none';
  }

  navigate('dashboard');
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('pncns_user');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  chartsInitialized = {};
}

// Allow Enter key on login + restore session on refresh
document.addEventListener('DOMContentLoaded', () => {
  ['username','password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  });

  const saved = sessionStorage.getItem('pncns_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
  }
});
