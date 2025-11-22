// Home page specific functionality with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initAnimations();
    
    // Hero image loading and functionality
    const hero = document.getElementById('hero');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    // Hero image loading
    const heroImage = new Image();
    heroImage.src = 'images/hero-bg.jpg';
    heroImage.onload = function() {
        hero.classList.remove('loading');
        console.log('Hero image loaded successfully');
        
        // Start hero text animations after image loads
        setTimeout(() => {
            document.querySelectorAll('.hero h1 span').forEach(span => {
                span.style.animationPlayState = 'running';
            });
            document.querySelector('.hero p').style.animationPlayState = 'running';
            document.querySelector('.hero-cta').style.animationPlayState = 'running';
        }, 200);
    };
    heroImage.onerror = function() {
        hero.classList.add('no-hero-image');
        hero.classList.remove('loading');
        console.log('Hero image failed to load, using fallback');
    };
    
    // Scroll indicator functionality
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('features').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Parallax effect for hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        if (parallax && window.innerWidth > 768) {
            const rate = scrolled * 0.5;
            parallax.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Booking Form Toggle
    const bookingToggle = document.getElementById('bookingToggle');
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingToggle && bookingForm) {
        bookingToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            bookingForm.classList.toggle('active');
            bookingToggle.classList.toggle('active');
            
            // Scroll to form when opening
            if (bookingForm.classList.contains('active')) {
                setTimeout(() => {
                    bookingForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            }
        });
    }
    
    // Close booking form when clicking outside
    document.addEventListener('click', function(e) {
        if (bookingForm && bookingForm.classList.contains('active')) {
            if (!bookingForm.contains(e.target) && !bookingToggle.contains(e.target)) {
                bookingForm.classList.remove('active');
                if (bookingToggle) {
                    bookingToggle.classList.remove('active');
                }
            }
        }
    });
    
    // Prevent form close when clicking inside form
    if (bookingForm) {
        bookingForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Booking Form Submission
    const bookingFormElement = document.getElementById('bookingFormElement');
    if (bookingFormElement) {
        bookingFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value,
                type: 'table_booking'
            };

            // Basic validation
            const errors = [];
            if (!data.name) errors.push('Name is required');
            if (!data.phone) errors.push('Phone number is required');
            if (!data.date) errors.push('Date is required');
            if (!data.time) errors.push('Time is required');
            if (!data.guests) errors.push('Number of guests is required');

            if (errors.length > 0) {
                alert('Please fill in all required fields: ' + errors.join(', '));
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;

            // Send to PHP backend
            fetch('php/process_booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification('Thank you for your reservation! We will contact you shortly to confirm your booking.', 'success');
                    this.reset();
                    
                    // Reset date to tomorrow
                    if (dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                    
                    // Close booking form
                    if (bookingForm) {
                        bookingForm.classList.remove('active');
                    }
                    if (bookingToggle) {
                        bookingToggle.classList.remove('active');
                    }
                } else {
                    showNotification('There was an error processing your booking. Please try again or contact us directly.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error processing your booking. Please try again or contact us directly.', 'error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Enhanced scroll animations for features
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for multiple cards
                const cards = document.querySelectorAll('.feature-card');
                cards.forEach((card, index) => {
                    if (card === entry.target) {
                        card.style.transitionDelay = `${index * 0.1}s`;
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        featureObserver.observe(card);
    });

    // Footer animation on scroll
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const columns = document.querySelectorAll('.footer-column');
                columns.forEach((column, index) => {
                    setTimeout(() => {
                        column.classList.add('animate-in');
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe footer
    const footer = document.querySelector('footer');
    if (footer) {
        footerObserver.observe(footer);
    }

    // Add loading class initially
    hero.classList.add('loading');
});

// Initialize all animations
function initAnimations() {
    // Add hover effects to all buttons
    const buttons = document.querySelectorAll('.btn, .booking-toggle');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add focus animations to form inputs
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Social media link animations
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Navigation link animations
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent-pink)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });

    console.log('Enhanced animations initialized');
}
