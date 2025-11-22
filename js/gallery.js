// Gallery page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery Filtering
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryCategories = document.querySelectorAll('.gallery-category');
    const loadingElement = document.querySelector('.gallery-loading');
    const noResultsElement = document.querySelector('.gallery-no-results');

    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Show loading
            if (loadingElement) {
                loadingElement.classList.add('active');
            }
            
            // Simulate loading delay for better UX
            setTimeout(() => {
                filterGalleryItems(filterValue);
                if (loadingElement) {
                    loadingElement.classList.remove('active');
                }
            }, 500);
        });
    });

    function filterGalleryItems(filter) {
        let visibleItems = 0;
        let visibleCategories = 0;

        galleryCategories.forEach(category => {
            let categoryVisible = false;
            const categoryItems = category.querySelectorAll('.gallery-item');
            
            categoryItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category') || 'all';
                const categoriesArray = itemCategories.split(' ');
                
                if (filter === 'all' || categoriesArray.includes(filter)) {
                    item.style.display = 'block';
                    visibleItems++;
                    categoryVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide category based on visible items
            if (categoryVisible) {
                category.style.display = 'block';
                visibleCategories++;
            } else {
                category.style.display = 'none';
            }
        });

        // Show no results message if no items visible
        if (noResultsElement) {
            if (visibleItems === 0) {
                noResultsElement.classList.add('active');
            } else {
                noResultsElement.classList.remove('active');
            }
        }

        // Scroll to top of gallery
        document.querySelector('.gallery-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Gallery item animation
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        galleryObserver.observe(item);
    });

    // Search functionality
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            galleryItems.forEach(item => {
                const altText = item.querySelector('img').alt.toLowerCase();
                const caption = item.getAttribute('data-caption') || '';
                
                if (altText.includes(searchTerm) || caption.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Keyboard navigation for image viewer
    document.addEventListener('keydown', function(e) {
        const imageViewer = document.getElementById('imageViewer');
        if (!imageViewer.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            document.getElementById('prevImage').click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('nextImage').click();
        }
    });

    // Download image functionality
    function setupDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-image');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const imgSrc = this.getAttribute('data-image-src');
                const link = document.createElement('a');
                link.href = imgSrc;
                link.download = 'eatery-flamingo-gallery.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    }

    setupDownloadButtons();

    // Social sharing
    function setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-image');
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const imgSrc = this.getAttribute('data-image-src');
                const pageUrl = window.location.href;
                const shareText = 'Check out this amazing photo from Eatery at Flamingo!';
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Eatery at Flamingo',
                        text: shareText,
                        url: pageUrl
                    });
                } else {
                    // Fallback: copy to clipboard or open in new window
                    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
                    window.open(shareUrl, '_blank');
                }
            });
        });
    }

    setupShareButtons();
});