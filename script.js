// ========== GESTION DES PAGES ==========
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const signupNavBtn = document.getElementById('signupNavBtn');
const loginNavBtn = document.getElementById('loginNavBtn');
const heroJoinBtn = document.getElementById('heroJoinBtn');
const homeJoinBtn2 = document.getElementById('homeJoinBtn2');

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active-page');
        if (page.id === pageId) {
            page.classList.add('active-page');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        if (pageId) showPage(pageId);
    });
});

if (signupNavBtn) signupNavBtn.addEventListener('click', () => showPage('signup'));
if (loginNavBtn) loginNavBtn.addEventListener('click', () => showPage('signup'));
if (heroJoinBtn) heroJoinBtn.addEventListener('click', () => showPage('signup'));
if (homeJoinBtn2) homeJoinBtn2.addEventListener('click', () => showPage('signup'));

// ========== MENU HAMBURGER ==========
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

function toggleMenu() {
    if (mainNav.classList.contains('show')) {
        mainNav.classList.remove('show');
    } else {
        mainNav.classList.add('show');
    }
}

function closeMenu() {
    mainNav.classList.remove('show');
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
    if (mainNav && mainNav.classList.contains('show')) {
        if (!mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeMenu();
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
});

// ========== GESTION DES UTILISATEURS ==========
let currentUser = null;

function loadUsers() {
    const users = localStorage.getItem('gymUsers');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('gymUsers', JSON.stringify(users));
}

function updateUIForUser() {
    const authDiv = document.getElementById('authButtons');
    const userInfoDiv = document.getElementById('userInfo');
    const userNameSpan = document.getElementById('userNameDisplay');
    
    if (currentUser) {
        if (authDiv) authDiv.style.display = 'none';
        if (userInfoDiv) userInfoDiv.style.display = 'flex';
        if (userNameSpan) userNameSpan.textContent = currentUser.nom;
    } else {
        if (authDiv) authDiv.style.display = 'flex';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }
}

// ========== FORMULAIRES AUTH ==========
function showSignupForm() {
    const container = document.getElementById('authFormContainer');
    if (!container) return;
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fas fa-user-plus"></i> Créer un compte</h2>
        <div class="social-buttons">
            <button class="btn-secondary" id="googleSocial"><i class="fab fa-google"></i> Google</button>
            <button class="btn-secondary" id="appleSocial"><i class="fab fa-apple"></i> Apple</button>
            <button class="btn-secondary" id="facebookSocial"><i class="fab fa-facebook-f"></i> FB</button>
        </div>
        <div class="divider"><span>OU</span></div>
        <form id="signupFormLocal">
            <input type="text" id="signupNom" placeholder="Nom complet" required>
            <input type="email" id="signupEmail" placeholder="Email" required>
            <input type="tel" id="signupTel" placeholder="Téléphone" required>
            <input type="password" id="signupPassword" placeholder="Mot de passe (min 6 caractères)" required>
            <button type="submit" class="btn-primary" style="width:100%">Créer mon compte</button>
        </form>
        <p style="margin-top:20px; text-align:center">Déjà un compte ? <a href="#" id="switchToLogin" style="color:#e63946">Se connecter</a></p>
    `;
    
    document.getElementById('signupFormLocal')?.addEventListener('submit', handleSignup);
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    document.getElementById('googleSocial')?.addEventListener('click', () => alert("Connexion Google bientôt disponible"));
    document.getElementById('appleSocial')?.addEventListener('click', () => alert("Connexion Apple bientôt disponible"));
    document.getElementById('facebookSocial')?.addEventListener('click', () => alert("Connexion Facebook bientôt disponible"));
}

function showLoginForm() {
    const container = document.getElementById('authFormContainer');
    if (!container) return;
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fas fa-sign-in-alt"></i> Se connecter</h2>
        <form id="loginFormLocal">
            <input type="email" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Mot de passe" required>
            <button type="submit" class="btn-primary" style="width:100%">Se connecter</button>
        </form>
        <p style="margin-top:20px; text-align:center">Pas encore de compte ? <a href="#" id="switchToSignup" style="color:#e63946">S'inscrire</a></p>
    `;
    
    document.getElementById('loginFormLocal')?.addEventListener('submit', handleLogin);
    document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
}

function handleSignup(e) {
    e.preventDefault();
    const nom = document.getElementById('signupNom')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const telephone = document.getElementById('signupTel')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    
    if (!nom || !email || !telephone || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }
    if (password.length < 6) {
        alert("Le mot de passe doit contenir au moins 6 caractères");
        return;
    }
    
    const users = loadUsers();
    if (users.find(u => u.email === email)) {
        alert("Cet email est déjà utilisé");
        return;
    }
    
    const newUser = { nom, email, telephone, password, subscription: null };
    users.push(newUser);
    saveUsers(users);
    
    alert(`✅ Compte créé avec succès, ${nom} ! Vous pouvez maintenant vous connecter.`);
    showLoginForm();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForUser();
        showPage('home');
        alert(`Bienvenue ${user.nom} !`);
        
        if (!user.subscription) {
            showSubscriptionModal();
        }
    } else {
        alert("Email ou mot de passe incorrect");
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForUser();
    showPage('home');
    alert("Déconnecté");
});

// ========== MODAL ABONNEMENT ==========
function showSubscriptionModal() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) modal.style.display = 'flex';
}

function hideSubscriptionModal() {
    const modal = document.getElementById('subscriptionModal');
    if (modal) modal.style.display = 'none';
}

function handleSubscription(plan) {
    if (currentUser) {
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].subscription = { plan, date: new Date().toISOString() };
            saveUsers(users);
            currentUser.subscription = users[userIndex].subscription;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
    
    alert(`Abonnement ${plan} sélectionné !\n\nPaiement via Natcash :\n📱 Compte: JOJOUP\n📞 Numéro: 33915778\n✉️ Email: jordensleyp@gmail.com\n\nAprès paiement, envoyez la confirmation pour activer votre accès à la salle.`);
    hideSubscriptionModal();
}

document.querySelector('.close-modal')?.addEventListener('click', hideSubscriptionModal);
document.getElementById('skipSubscriptionBtn')?.addEventListener('click', hideSubscriptionModal);
document.querySelectorAll('.pay-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const plan = btn.getAttribute('data-plan');
        handleSubscription(plan);
    });
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('subscriptionModal');
    if (e.target === modal) hideSubscriptionModal();
});

// ========== PAIEMENT NATCASH ==========
document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const plan = btn.getAttribute('data-plan');
        alert(`🔴 Paiement ${plan} par Natcash\n\n✅ Compte: JOJOUP\n📞 Numéro: 33915778\n📧 Email: jordensleyp@gmail.com\n\nAprès paiement, envoyez la confirmation pour activer votre abonnement.`);
    });
});

document.getElementById('copyNatcashBtn')?.addEventListener('click', () => {
    const text = "Compte Natcash: JOJOUP\nNuméro: 33915778\nEmail: jordensleyp@gmail.com";
    navigator.clipboard.writeText(text).then(() => {
        alert("✅ Infos Natcash copiées !");
    }).catch(() => {
        alert("📋 Copiez manuellement:\n" + text);
    });
});

// ========== FORMULAIRE CONTACT ==========
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("✅ Message envoyé ! Nous vous répondrons rapidement.");
    e.target.reset();
});

// ========== ANIMATIONS SCROLL ==========
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

animatedElements.forEach(el => observer.observe(el));
document.querySelectorAll('section').forEach(s => s.classList.add('animate-on-scroll'));

// ========== RESTAURER SESSION ==========
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForUser();
}

// Initialiser les formulaires auth si on est sur la page signup
if (window.location.hash === '#signup' || document.getElementById('signup').classList.contains('active-page')) {
    showSignupForm();
        }
