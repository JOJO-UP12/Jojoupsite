// ---------- GLOBAL STATE ----------
let currentUser = localStorage.getItem('ironfit_user') ? JSON.parse(localStorage.getItem('ironfit_user')) : null;

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-menu a');
const authDiv = document.getElementById('authButtons');
const userInfoDiv = document.getElementById('userInfo');
const userNameSpan = document.getElementById('userNameDisplay');

// Helper: show toast
function showToast(msg, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// Navigation
function switchPage(pageId) {
    pages.forEach(page => page.classList.remove('active-page'));
    const activePage = document.getElementById(pageId);
    if(activePage) activePage.classList.add('active-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // close mobile menu if open
    document.getElementById('navMenu').classList.remove('show');
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if(page) switchPage(page);
    });
});

// Mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Update UI based on auth
function updateAuthUI() {
    if(currentUser) {
        authDiv.style.display = 'none';
        userInfoDiv.style.display = 'flex';
        userNameSpan.innerText = currentUser.name.split(' ')[0];
    } else {
        authDiv.style.display = 'flex';
        userInfoDiv.style.display = 'none';
    }
}

// Modal management
const signupModal = document.getElementById('signupModal');
const loginModal = document.getElementById('loginModal');
const subscriptionModal = document.getElementById('subscriptionModal');
let currentPlan = '';

function openModal(modal) {
    modal.style.display = 'flex';
}
function closeModal(modal) {
    modal.style.display = 'none';
}

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        signupModal.style.display = 'none';
        loginModal.style.display = 'none';
        subscriptionModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if(e.target === signupModal) signupModal.style.display = 'none';
    if(e.target === loginModal) loginModal.style.display = 'none';
    if(e.target === subscriptionModal) subscriptionModal.style.display = 'none';
});

// Auth logic
document.getElementById('signupNavBtn').addEventListener('click', () => openModal(signupModal));
document.getElementById('loginNavBtn').addEventListener('click', () => openModal(loginModal));

document.getElementById('signupFormModal').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if(!name || !email || !password) {
        showToast("Veuillez remplir tous les champs");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('ironfit_users') || '[]');
    if(users.find(u => u.email === email)) {
        showToast("Cet email est déjà utilisé");
        return;
    }
    
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('ironfit_users', JSON.stringify(users));
    currentUser = { name, email };
    localStorage.setItem('ironfit_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal(signupModal);
    showToast("Inscription réussie ! Bienvenue chez IronFit");
    switchPage('home');
});

document.getElementById('loginFormModal').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('ironfit_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if(!user) {
        showToast("Email ou mot de passe incorrect");
        return;
    }
    
    currentUser = { name: user.name, email: user.email };
    localStorage.setItem('ironfit_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal(loginModal);
    showToast(`Bon retour ${user.name} !`);
    switchPage('home');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('ironfit_user');
    updateAuthUI();
    showToast("Déconnecté avec succès");
    switchPage('home');
});

// Subscription & payment flow
const payBtns = document.querySelectorAll('.pay-btn');
const selectedPlanSpan = document.getElementById('selectedPlan');

payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if(!currentUser) {
            showToast("Veuillez vous inscrire ou vous connecter d'abord");
            openModal(loginModal);
            return;
        }
        currentPlan = btn.getAttribute('data-plan');
        selectedPlanSpan.innerText = currentPlan;
        openModal(subscriptionModal);
    });
});

document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
    if(!currentUser) return;
    
    // Store subscription in localStorage for demo
    const subscriptions = JSON.parse(localStorage.getItem('ironfit_subs') || '[]');
    subscriptions.push({
        userId: currentUser.email,
        plan: currentPlan,
        date: new Date().toISOString(),
        status: 'active'
    });
    localStorage.setItem('ironfit_subs', JSON.stringify(subscriptions));
    closeModal(subscriptionModal);
    showToast(`✅ Abonnement ${currentPlan} activé ! Merci pour votre confiance.`);
    switchPage('home');
});

document.getElementById('cancelModalBtn').addEventListener('click', () => {
    closeModal(subscriptionModal);
});

// Copy Natcash info
document.getElementById('copyNatcashBtn').addEventListener('click', () => {
    navigator.clipboard.writeText("33915778 - JOJOUP - jordensleyp@gmail.com").then(() => {
        showToast("Infos Natcash copiées !");
    }).catch(() => {
        showToast("Appuyez longuement pour copier");
    });
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const msg = document.getElementById('contactMsg').value;
    
    if(name && email && msg) {
        showToast(`Merci ${name}, votre message a été envoyé !`);
        document.getElementById('contactForm').reset();
    } else {
        showToast("Veuillez remplir tous les champs");
    }
});

// Hero buttons redirect to signup
function handleJoin() {
    if(!currentUser) {
        openModal(signupModal);
    } else {
        showToast("Vous êtes déjà membre !");
    }
}

document.getElementById('heroJoinBtn').addEventListener('click', handleJoin);
document.getElementById('homeJoinBtn2').addEventListener('click', handleJoin);

// Scroll animation with Intersection Observer
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => observer.observe(el));

// Initial UI
updateAuthUI();

// If no users exist, create demo user for test convenience
if(!localStorage.getItem('ironfit_users')) {
    const demoUsers = [{ id: 1, name: "Jean Dupont", email: "test@ironfit.com", password: "123456" }];
    localStorage.setItem('ironfit_users', JSON.stringify(demoUsers));
}
