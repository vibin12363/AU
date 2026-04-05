// ── TWO-WAY LOCK: If already logged in, go back to spa ───
// This is the KEY fix — even if the browser somehow shows
// index.html via back button, this immediately bounces them
// back to spa.html, making escape impossible without logout.
(function () {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const lsToken  = localStorage.getItem("sessionToken");
    const ssToken  = sessionStorage.getItem("sessionToken");
    if (loggedIn === "true" && lsToken && ssToken && lsToken === ssToken) {
        window.location.replace("spa.html");
    }
})();

// ── Back/Forward button lock on login page ────────────────
(function () {
    window.history.replaceState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, null, window.location.href);
    };
})();

// ── Hashed credentials ────────────────────────────────────
const HASH_REG    = "cf4f3d5806846d92b695451d425ed6f72ea9913b020e64fc4cab2d9ae25b8047";
const HASH_DOB    = "a1e14920ac269fda52e49309354117b32aad04937209f478b20ffc0686f566e4";
const STORED_NAME = "Vibin I";

// ── SHA-256 via Web Crypto API ────────────────────────────
async function sha256(message) {
    const msgBuffer  = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Login handler ─────────────────────────────────────────
async function checkLogin(e) {
    e.preventDefault();
    const reg   = document.getElementById("reg").value.trim();
    const dob   = document.getElementById("dob").value;
    const errEl = document.getElementById("error");

    const [hashReg, hashDob] = await Promise.all([sha256(reg), sha256(dob)]);

    if (hashReg === HASH_REG && hashDob === HASH_DOB) {
        const token = crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem("isLoggedIn",    "true");
        localStorage.setItem("username",      STORED_NAME);
        localStorage.setItem("sessionToken",  token);
        sessionStorage.setItem("sessionToken", token);
        window.location.replace("spa.html");
    } else {
        errEl.textContent = "Invalid Register Number or DOB!";
    }
}

document.getElementById("loginForm").addEventListener("submit", checkLogin);