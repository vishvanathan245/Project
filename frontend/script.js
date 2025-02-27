// Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const nameInput = document.getElementById('login-name');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const regNameInput = document.getElementById('register-name');
const regEmailInput = document.getElementById('register-email');
const regPasswordInput = document.getElementById('register-password');
const dashboard = document.getElementById('dashboard-container');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const userNameDisplay = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

// Function to handle user registration
registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value.trim();

    if (!name || !email || !password) {
        alert('⚠️ Please fill in all fields.');
        return;
    }

    // Send registration request
    fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Show error message from backend
            return;
        }

        alert('✅ Registration successful! You can now log in.');
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    })
    .catch(error => {
        console.error('❌ Registration Error:', error);
        alert("❌ Registration failed. Try again.");
    });
});

// Function to handle user login
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
        alert('⚠️ Please fill in all fields.');
        return;
    }

    // Check if user exists
    fetch('http://localhost:5000/loginUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            return;
        }

        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(data));

        // Show dashboard
        showDashboard(data.name, data.email);
    })
    .catch(error => {
        console.error('❌ Login Error:', error);
        alert(error.message || 'Login failed. Please try again.');
    });
});

// Function to show dashboard
function showDashboard(name, email) {
    userNameDisplay.textContent = name;
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
}

// Function to handle logout
logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('user');
    loginContainer.classList.remove('hidden');
    dashboard.classList.add('hidden');
});

// Auto-login if user exists
document.addEventListener('DOMContentLoaded', function () {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const { name, email } = JSON.parse(savedUser);
        showDashboard(name, email);
    }
});
