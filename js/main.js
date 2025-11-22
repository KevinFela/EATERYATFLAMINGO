// Common functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                mobileMenu.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Update WhatsApp links with actual number
    function updateWhatsAppLinks() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        const phoneNumber = '27621369848';
        
        whatsappLinks.forEach(link => {
            const currentHref = link.getAttribute('href');
            const newHref = currentHref.replace(/wa\.me\/\d+/, `wa.me/${phoneNumber}`);
            link.setAttribute('href', newHref);
        });
    }
    
    updateWhatsAppLinks();

    // Set active navigation link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveNavLink();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image Viewer Functionality
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const closeViewer = document.getElementById('closeViewer');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');
    const imageCounter = document.getElementById('imageCounter');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    let currentGallery = '';

    // Get images from specific gallery
    function getGalleryImages(galleryType) {
        const images = [];
        let selector = '';
        
        switch(galleryType) {
            case 'gallery':
                selector = '.gallery-item img';
                break;
            case 'menu-food':
                selector = '#food .square-gallery-item img';
                break;
            case 'menu-alcohol':
                selector = '#alcohol .square-gallery-item img';
                break;
            case 'services':
                selector = '#services img';
                break;
            default:
                selector = 'img[data-viewer]';
        }
        
        document.querySelectorAll(selector).forEach(img => {
            if (img.src && !img.src.includes('data:')) {
                images.push({
                    src: img.getAttribute('data-src') || img.src,
                    alt: img.alt || 'Gallery Image'
                });
            }
        });
        
        return images;
    }

    // Open image viewer
    function openImageViewer(index, galleryType) {
        currentImageIndex = index;
        currentGallery = galleryType;
        galleryImages = getGalleryImages(galleryType);
        
        if (galleryImages.length === 0) return;
        
        viewerImage.src = galleryImages[currentImageIndex].src;
        viewerImage.alt = galleryImages[currentImageIndex].alt;
        updateImageCounter();
        imageViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close image viewer
    function closeImageViewer() {
        imageViewer.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate to previous image
    function showPrevImage() {
        if (galleryImages.length === 0) return;
        
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        viewerImage.src = galleryImages[currentImageIndex].src;
        viewerImage.alt = galleryImages[currentImageIndex].alt;
        updateImageCounter();
    }

    // Navigate to next image
    function showNextImage() {
        if (galleryImages.length === 0) return;
        
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        viewerImage.src = galleryImages[currentImageIndex].src;
        viewerImage.alt = galleryImages[currentImageIndex].alt;
        updateImageCounter();
    }

    // Update image counter
    function updateImageCounter() {
        if (imageCounter) {
            imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        }
    }

    // Initialize image viewer if elements exist
    if (imageViewer && viewerImage) {
        // Close viewer events
        closeViewer.addEventListener('click', closeImageViewer);
        imageViewer.addEventListener('click', function(e) {
            if (e.target === imageViewer) {
                closeImageViewer();
            }
        });

        // Navigation events
        prevImage.addEventListener('click', showPrevImage);
        nextImage.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (imageViewer.classList.contains('active')) {
                if (e.key === 'Escape') {
                    closeImageViewer();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                }
            }
        });

        // Swipe navigation for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        imageViewer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        imageViewer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                showNextImage();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                showPrevImage();
            }
        }

        // Add click events to gallery images
        document.addEventListener('click', function(e) {
            if (e.target.matches('.gallery-item img, .square-gallery-item img, [data-viewer]')) {
                const img = e.target;
                const galleryType = img.closest('#gallery') ? 'gallery' : 
                                  img.closest('#food') ? 'menu-food' :
                                  img.closest('#alcohol') ? 'menu-alcohol' :
                                  img.closest('#services') ? 'services' : 'general';
                
                const galleryImages = getGalleryImages(galleryType);
                const imgSrc = img.getAttribute('data-src') || img.src;
                const imgIndex = galleryImages.findIndex(image => image.src === imgSrc);
                
                if (imgIndex !== -1) {
                    openImageViewer(imgIndex, galleryType);
                }
            }
        });
    }

    // Form validation helper
    window.validateForm = function(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }
        
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!formData.phone || formData.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        return errors;
    };

    // Show notification
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    };

    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(notificationStyles);
});