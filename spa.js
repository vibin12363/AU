// --- Security and Initialization Check (Must run first) ---

// 1. Check for Back/Forward Button Cache access (Security against BFCache)
if (window.performance && window.performance.navigation.type === 2) {
    window.location.href = "home.html";
}

// 2. Check Login Status (Core Security Gate)
const loggedIn = localStorage.getItem("isLoggedIn");
const user = localStorage.getItem("username");

if (loggedIn !== "true") {
    // If NOT logged in, redirect immediately to the login page
    window.location.href = "home.html";
}

// 3. Dynamic User Welcome
if (user && document.getElementById("user-welcome-text")) {
    document.getElementById("user-welcome-text").innerHTML = 'Welcome ' + user + ' !';
}

// --- Logout Function ---
function logout(event) {
    event.preventDefault(); // Stop the link from navigating by default
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "home.html"; // Redirect to login page
}

// 4. Attach logout function to the element (assuming there is a logout link/button with an ID)
// You may need to replace 'logout-link-id' with the actual ID of your logout element
// Example: document.getElementById("logout-link-id").addEventListener("click", logout);

// --- Dashboard Functionality (Print, Content Loading) ---

// Print functionality
document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
});

// Dynamic Content Loading and Button Highlighting
const menuButtons = document.querySelectorAll('.menu-btn');
const contentSections = document.querySelectorAll('.content-section');
const contentArea = document.getElementById('content-area'); // Not used, but kept for context

function showContent(contentId) {
    // 1. Hide all content sections
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    // 2. Show the selected content section
    const selectedSection = document.getElementById(contentId + '-content');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // 3. Update active state of buttons
    menuButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-content-id') === contentId) {
            button.classList.add('active');
        }
    });
}

// Add click to event listeners to menu buttons
menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        const contentId = button.getAttribute('data-content-id');
        showContent(contentId);
    });
});

// Initialize the page by showing the default content (Profile)
showContent('profile');