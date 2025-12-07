// Password Toggle Functionality
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle icon
    const icon = this.querySelector('.material-symbols-outlined');
    icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
});

// Toggle confirm password visibility
toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);

    // Toggle icon
    const icon = this.querySelector('.material-symbols-outlined');
    icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
});

// Form Validation and Submission
const signupForm = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');

signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const location = document.getElementById('location').value.trim();
    const termsAccepted = document.getElementById('terms').checked;

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Creating Account...';

    // Simulate API call (replace with actual backend integration)
    setTimeout(() => {
        // Store user data (in a real app, this would be sent to a backend)
        const userData = {
            fullname,
            email,
            location: location || 'Not specified',
            createdAt: new Date().toISOString()
        };

        // Store in localStorage (temporary - use proper backend in production)
        localStorage.setItem('weatherAppUser', JSON.stringify(userData));

        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 1500);
});

// Notification Function
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 12px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
        color: white;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Append to body
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Social Login Handlers (placeholder - implement with actual OAuth)
const googleBtn = document.querySelector('.google-btn');
const facebookBtn = document.querySelector('.facebook-btn');

googleBtn.addEventListener('click', function () {
    showNotification('Google sign-up coming soon!', 'error');
});

facebookBtn.addEventListener('click', function () {
    showNotification('Facebook sign-up coming soon!', 'error');
});

// Add smooth scroll behavior
document.querySelector('.back-btn').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'index.html';
});

// Input focus animations
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
});
