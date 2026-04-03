// ── Back/Forward button lock ──────────────────────────────
(function () {
    window.history.replaceState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, null, window.location.href);
    };
})();

// ── Hashed credentials ────────────────────────────────────
// Your actual reg number and DOB are NOT stored here.
// These are SHA-256 hashes — they cannot be reversed back
// to the original values. Login still works exactly the same.
const HASH_REG = "cf4f3d5806846d92b695451d425ed6f72ea9913b020e64fc4cab2d9ae25b8047";
const HASH_DOB = "a1e14920ac269fda52e49309354117b32aad04937209f478b20ffc0686f566e4";
const STORED_NAME = "Vibin I";

// ── Hash function (SHA-256 via Web Crypto API) ────────────
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Login handler ─────────────────────────────────────────
async function checkLogin(e) {
    e.preventDefault();

    const reg = document.getElementById("reg").value.trim();
    const dob = document.getElementById("dob").value;
    const errEl = document.getElementById("error");

    // Hash what the user typed, then compare to stored hashes
    const [hashReg, hashDob] = await Promise.all([sha256(reg), sha256(dob)]);

    if (hashReg === HASH_REG && hashDob === HASH_DOB) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", STORED_NAME);
        window.location.href = "spa.html";
    } else {
        errEl.textContent = "Invalid Register Number or DOB!";
    }
}

document.getElementById("loginForm").addEventListener("submit", checkLogin);