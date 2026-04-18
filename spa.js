// ═══════════════════════════════════════════════════════════
//  SECURITY
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
    window.location.replace("index.html");
}

// ── Initial auth check ────────────────────────────────────
if (!isAuthenticated()) {
    redirectToLogin();
}

// ── Browser close detection ──────────────────────────────
// When spa.html is hidden (app switched, browser minimised, or closed),
// save a timestamp. On the next pageshow we measure how long we were away.
// If it exceeds the threshold we treat it as a browser-close and logout.
const CLOSE_THRESHOLD_MS = 60 * 1000; // 60 seconds — adjust if needed

window.addEventListener("pagehide", function () {
    localStorage.setItem("spaHiddenAt", Date.now());
});

window.addEventListener("pageshow", function (e) {
    const hiddenAt = parseInt(localStorage.getItem("spaHiddenAt") || "0");
    const awayMs = Date.now() - hiddenAt;

    // Case 1: restored from BFCache AND away long enough → browser was closed
    if (e.persisted && hiddenAt && awayMs > CLOSE_THRESHOLD_MS) {
        localStorage.removeItem("spaHiddenAt");
        redirectToLogin();
        return;
    }

    // Case 2: auth tokens gone (other-device / sessionStorage wiped) → redirect
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }

    localStorage.removeItem("spaHiddenAt");
});

// ── Visibility change (tab switch / focus return) ─────────
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        const hiddenAt = parseInt(localStorage.getItem("spaHiddenAt") || "0");
        const awayMs = Date.now() - hiddenAt;

        if (hiddenAt && awayMs > CLOSE_THRESHOLD_MS) {
            localStorage.removeItem("spaHiddenAt");
            redirectToLogin();
            return;
        }
        if (!isAuthenticated()) {
            redirectToLogin();
        }
    }
});

// ── Back button lock ──────────────────────────────────────
// Push only 3 states (avoids browser rate-limit throttling)
// The real safety net is home.js bouncing them back here
function buildSafetyStack() {
    window.history.pushState({ spa: true }, "", window.location.href);
    window.history.pushState({ spa: true }, "", window.location.href);
    window.history.pushState({ spa: true }, "", window.location.href);
}

buildSafetyStack();

window.addEventListener("popstate", function () {
    if (!isAuthenticated()) {
        redirectToLogin();
        return;
    }
    // Rebuild stack and show toast every single time back is pressed
    buildSafetyStack();
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
    sessionStorage.setItem('activeTab', contentId); // remember across refresh
    contentSections.forEach(s => {
        s.style.display = 'none';
        s.classList.remove('type-animate'); // reset animation
    });
    const target = document.getElementById(contentId + '-content');
    if (target) {
        target.style.display = 'block';
        // Force reflow so animation restarts fresh every time
        void target.offsetWidth;
        target.classList.add('type-animate');
    }
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

// Restore last active tab, fallback to profile
const lastTab = sessionStorage.getItem('activeTab') || 'profile';
showContent(lastTab);

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