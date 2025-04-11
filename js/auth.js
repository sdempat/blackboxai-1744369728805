// Auth State
window.currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupAuthListeners();
    setupUIHandlers();
});

// Check Authentication State
function checkAuthState() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForAuthenticatedUser();
        // Redirect to dashboard if on login/register page
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Redirect to login if trying to access protected pages
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Setup Auth Event Listeners
function setupAuthListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Google Sign In
    const googleSignIn = document.getElementById('googleSignIn');
    if (googleSignIn) {
        googleSignIn.addEventListener('click', handleGoogleSignIn);
    }

    // Google Sign Up
    const googleSignUp = document.getElementById('googleSignUp');
    if (googleSignUp) {
        googleSignUp.addEventListener('click', handleGoogleSignIn);
    }
}

// Setup UI Event Handlers
function setupUIHandlers() {
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? 
                '<i class="far fa-eye"></i>' : 
                '<i class="far fa-eye-slash"></i>';
        });
    }

    // User Dropdown Menu
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenu && userDropdown) {
        userMenu.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!userMenu.contains(event.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Here you would typically make an API call to your backend
        // For demo purposes, we'll use localStorage
        if (email && password) {
            const user = {
                email,
                name: email.split('@')[0], // Simple name extraction
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            currentUser = user;
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        showError('Login failed. Please check your credentials.');
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const fullName = document.getElementById('fullName').value;
    
    try {
        // Validate passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        // Here you would typically make an API call to your backend
        // For demo purposes, we'll use localStorage
        if (email && password && fullName) {
            const user = {
                email,
                name: fullName,
                avatar: `https://ui-avatars.com/api/?name=${fullName}&background=random`
            };
            
            localStorage.setItem('user', JSON.stringify(user));
            currentUser = user;
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        showError(error.message || 'Registration failed. Please try again.');
    }
}

// Handle Logout
function handleLogout(event) {
    event.preventDefault();
    
    localStorage.removeItem('user');
    currentUser = null;
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Handle Google Sign In
async function handleGoogleSignIn() {
    try {
        // Here you would typically implement Google OAuth
        // For demo purposes, we'll create a mock user
        const user = {
            email: 'demo@gmail.com',
            name: 'Demo User',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        currentUser = user;
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError('Google sign in failed. Please try again.');
    }
}

// Update UI for Authenticated User
function updateUIForAuthenticatedUser() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
}

// Show Error Message
function showError(message) {
    // You could implement a toast notification here
    alert(message);
}
