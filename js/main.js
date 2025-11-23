// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality with slide from right
    const mobileMenu = document.getElementById('mobileMenu');
    const mainNav = document.getElementById('mainNav');
    const navClose = document.getElementById('navClose');
    const body = document.body;
    
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', function() {
            mainNav.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent background scroll
            mobileMenu.classList.add('active');
            
            // Change to X icon
            const menuIcon = mobileMenu.querySelector('i');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        });
        
        // Close navigation when X is clicked
        if (navClose) {
            navClose.addEventListener('click', function() {
                mainNav.classList.remove('active');
                body.style.overflow = 'auto'; // Restore scroll
                mobileMenu.classList.remove('active');
                
                // Change back to hamburger icon
                const menuIcon = mobileMenu.querySelector('i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        }
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                body.style.overflow = 'auto';
                mobileMenu.classList.remove('active');
                
                // Reset to hamburger icon
                const menuIcon = mobileMenu.querySelector('i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        });
        
        // Close mobile menu when clicking outside (on overlay)
        mainNav.addEventListener('click', function(e) {
            if (e.target === mainNav) {
                mainNav.classList.remove('active');
                body.style.overflow = 'auto';
                mobileMenu.classList.remove('active');
                
                // Reset to hamburger icon
                const menuIcon = mobileMenu.querySelector('i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                body.style.overflow = 'auto';
                mobileMenu.classList.remove('active');
                
                // Reset to hamburger icon
                const menuIcon = mobileMenu.querySelector('i');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset;
        
        if (header) {
            if (scrolled > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 2px 20px var(--shadow-light)';
            } else {
                header.style.backgroundColor = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
            }
        }
    });

    // Initialize header on load
    const header = document.querySelector('header');
    if (header && window.pageYOffset > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px var(--shadow-light)';
    }
});

// Notification function
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 18px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 450px;
        animation: slideInRight 0.6s ease, slideOutRight 0.6s ease 2.5s forwards;
        font-weight: 600;
        font-size: 15px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}