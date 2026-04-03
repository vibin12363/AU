// ═══════════════════════════════════════════════════════════
//  SECURITY — Cross-device / cross-browser protection
//  localStorage does NOT sync between devices or browsers,
//  so copying the URL to another phone will always redirect
//  to home.html since that device has no login token.
// ═══════════════════════════════════════════════════════════

function isAuthenticated() {
    const loggedIn = localStorage.getItem("isLoggedIn");
    // Additional check: the sessionToken must match
    // (prevents manually setting localStorage from DevTools on same browser)
    const lsToken = localStorage.getItem("sessionToken");
    const ssToken = sessionStorage.getItem("sessionToken");
    return loggedIn === "true" && lsToken && ssToken && lsToken === ssToken;
}

function redirectToLogin() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionToken");
    window.location.replace("home.html");
}

// ── Initial auth check (runs on every page load / URL share) ──
if (!isAuthenticated()) {
    redirectToLogin();
}

// ── BFCache (Back/Forward cache) protection ───────────────────
// Using `pageshow` with `persisted` flag is the modern standard
window.addEventListener("pageshow", function (e) {
    if (e.persisted && !isAuthenticated()) {
        redirectToLogin();
    }
});

// ── Prevent back-button navigation after logout ───────────────
window.history.replaceState(null, null, window.location.href);
window.addEventListener("popstate", function () {
    window.history.pushState(null, null, window.location.href);
    if (!isAuthenticated()) redirectToLogin();
});

// ── Dynamic welcome text ──────────────────────────────────────
const user    = localStorage.getItem("username");
const welcomeEl = document.getElementById("user-welcome-text");
if (user && welcomeEl) {
    welcomeEl.innerHTML = 'Welcome, <span>' + user + '</span> !';
}

// ── Logout ────────────────────────────────────────────────────
function logout(event) {
    event.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    window.location.replace("home.html");
}

// ── Print ─────────────────────────────────────────────────────
document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
});

// ═══════════════════════════════════════════════════════════
//  MAIN NAV — Tab switching
// ═══════════════════════════════════════════════════════════
const menuButtons    = document.querySelectorAll('.menu-btn');
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
    const targetBtn = document.querySelector(`.sub-tab-btn[data-sub="${tabId}"]`);
    if (targetSection) targetSection.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
}

subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => showSubTab(btn.getAttribute('data-sub')));
});