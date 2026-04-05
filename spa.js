// ═══════════════════════════════════════════════════════════
//  SECURITY — Cross-device / cross-browser protection
// ═══════════════════════════════════════════════════════════

function isAuthenticated() {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const lsToken = localStorage.getItem("sessionToken");
    const ssToken = sessionStorage.getItem("sessionToken");
    return loggedIn === "true" && lsToken && ssToken && lsToken === ssToken;
}

function redirectToLogin() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionToken");
    // Replace entire history so forward button is also dead
    window.location.replace("index.html");
}

// ── Initial auth check ────────────────────────────────────
if (!isAuthenticated()) {
    redirectToLogin();
}

// ── BFCache protection (handles forward button cache) ─────
// If browser restores page from cache, re-verify auth
window.addEventListener("pageshow", function (e) {
    if (e.persisted && !isAuthenticated()) {
        redirectToLogin();
    }
});

// ── Visibility change protection ──────────────────────────
// Catches tab-switching back to this page
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && !isAuthenticated()) {
        redirectToLogin();
    }
});

// ── Back / Forward button — block completely ───────────────
// Push a deep stack of states so user can't press back enough times to escape
function pushSafetyStack(count) {
    for (let i = 0; i < count; i++) {
        window.history.pushState({ spa: true }, "", window.location.href);
    }
}

// Push 30 states on load — user would need to press back 30 times
pushSafetyStack(30);

window.addEventListener("popstate", function () {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }
    // Rebuild the safety stack every time back is pressed
    pushSafetyStack(30);
    showBackToast();
});

function showBackToast() {
    const toast = document.getElementById("back-toast");
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ── Dynamic welcome text ──────────────────────────────────
const user = localStorage.getItem("username");
const welcomeEl = document.getElementById("user-welcome-text");
if (user && welcomeEl) {
    welcomeEl.innerHTML = 'Welcome, <span>' + user + '</span> !';
}

// ── Logout ────────────────────────────────────────────────
function logout(event) {
    event.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    // Replace the entire history entry so forward button is disabled
    window.location.replace("index.html");
}

// ── Print ─────────────────────────────────────────────────
document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
});

// ═══════════════════════════════════════════════════════════
//  MAIN NAV — Tab switching
// ═══════════════════════════════════════════════════════════
const menuButtons = document.querySelectorAll('.menu-btn');
const contentSections = document.querySelectorAll('.content-section');

function showContent(contentId) {
    contentSections.forEach(s => s.style.display = 'none');
    const target = document.getElementById(contentId + '-content');
    if (target) target.style.display = 'block';
    menuButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-content-id') === contentId) {
            btn.classList.add('active');
        }
    });
}

menuButtons.forEach(btn => {
    btn.addEventListener('click', () => showContent(btn.getAttribute('data-content-id')));
});

showContent('profile'); // default

// ═══════════════════════════════════════════════════════════
//  GPA | CGPA — Sub-tab switching
// ═══════════════════════════════════════════════════════════
const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const subSections = document.querySelectorAll('.sub-section');

function showSubTab(tabId) {
    subSections.forEach(s => s.classList.remove('active'));
    subTabBtns.forEach(b => b.classList.remove('active'));
    const targetSection = document.getElementById('sub-' + tabId);
    const targetBtn = document.querySelector('.sub-tab-btn[data-sub="' + tabId + '"]');
    if (targetSection) targetSection.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
}

subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => showSubTab(btn.getAttribute('data-sub')));
});