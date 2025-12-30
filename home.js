// Security: Prevent navigation back to login page after successful login
        // This line replaces the window.onpopstate check you had, making it cleaner.

        (function () {
            window.history.replaceState(null, null, window.location.href);
            window.onpopstate = function () {
                // If the user tries to go back, they are immediately pushed forward again
                window.history.pushState(null, null, window.location.href);
            };
        })();


        // --- Authentication Logic ---
        function checkLogin(e) {
            // Prevent the form from submitting the traditional way
            if (e) e.preventDefault();

            // Get input values (assuming your input IDs are 'reg' and 'dob')
            const reg = document.getElementById("reg").value.trim();
            const dob = document.getElementById("dob").value;

            // --- YOUR MASTER AUTHENTICATION DATA ---
            const correctReg = "960923104020";
            const correctDob = "2006-07-29";
            const correctUsername = "Vibin I";

            if (reg === correctReg && dob === correctDob) {
                // 1. Store the successful status using the flag 'isLoggedIn'
                localStorage.setItem("isLoggedIn", "true");
                // 2. Store the username for display on the dashboard
                localStorage.setItem("username", correctUsername);

                // 3. Redirect to the main dashboard page
                window.location.href = "spa.html";

            } else {
                // Display error message
                document.getElementById("error").textContent = "Invalid Register Number or DOB!";
            }
        }

        // Attach the function to the form submission event
        document.getElementById("loginForm").addEventListener("submit", checkLogin);