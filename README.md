# 📊 Vibin's Result Page

A secure, mobile-responsive personal academic dashboard built with
vanilla HTML, CSS and JavaScript. No frameworks, no backend —
just clean frontend code deployed via Netlify.

## ✨ Features

- 🔐 **Secure Login** — SHA-256 hashed credentials via Web Crypto API
- 📱 **Fully Responsive** — works on mobile, tablet and desktop
- 📅 **Exam Schedule** — semester-wise timetables (Sem 1–5)
- 📜 **Exam Results** — grade and pass/fail status for all semesters
- 📊 **GPA | CGPA** — semester-wise GPA scores and cumulative CGPA
- 🔔 **Notifications** — academic announcements and deadlines
- ⬇️ **Downloads** — direct PDF downloads for timetables, results, GPA and CGPA
- 🖨️ **Print Support** — prints only the active tab content
- 💾 **Tab Memory** — remembers your last active tab across page refreshes
- ⌨️ **Typewriter Animation** — smooth reveal animation on every tab switch
- 🔒 **Back Button Lock** — prevents navigating back to dashboard after logout
- ⏱️ **Auto Logout** — logs out automatically when browser is closed for 1+ minute
- 🌐 **Cross-device Protection** — shared URLs won't open the dashboard without login

## 🛡️ Security

- Passwords are never stored — only SHA-256 hashes are kept in the JS file
- Dual-token system using both `localStorage` and `sessionStorage`
- `sessionStorage` ensures fresh login is required on every new browser session
- `pagehide` timestamp + `pageshow` gap detection handles mobile browser close
- 30-state history stack prevents back-button escape from the dashboard
- Two-way lock — login page bounces already-authenticated users back to dashboard

## 🗂️ Project Structure

├── index.html          # Login page
├── home.css            # Login page styles
├── home.js             # Login logic + SHA-256 auth
├── spa.html            # Dashboard (single-page app)
├── spa.css             # Dashboard styles
├── spa.js              # Dashboard logic + security
├── resources/          # Logo and icons
├── Timetable/          # Semester timetable PDFs
├── Result/             # Semester result PDFs
├── gpa/                # GPA PDFs
└── cgpa/               # CGPA PDFs

## 🚀 Deployment

Deployed on **Netlify** with zero build configuration.

- Build command: *(none)*
- Publish directory: *(root)*
- Live at: `https://your-site.netlify.app`

To deploy your own copy:
1. Fork this repository
2. Go to [netlify.com](https://netlify.com) and connect your GitHub
3. Select this repo — Netlify auto-detects it needs no build step
4. Done ✅

## 🛠️ Built With

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox, Animations)
- Vanilla JavaScript (Web Crypto API, localStorage, sessionStorage, History API)
- Google Fonts — Outfit
- Netlify (Hosting)

## 📄 License

This is a personal academic project. Not intended for public reuse.
