// Menu page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Menu data structure
    const menuData = {
        food: {
            title: "Food Menu",
            pages: [
                { src: 'images/menu-food-1.jpg', alt: 'Food Menu Page 1 - Starters & Appetizers', category: 'starters' },
                { src: 'images/menu-food-2.jpg', alt: 'Food Menu Page 2 - Main Courses', category: 'mains' },
                { src: 'images/menu-food-3.jpg', alt: 'Food Menu Page 3 - Grills & Specialties', category: 'mains' },
                { src: 'images/menu-food-4.jpg', alt: 'Food Menu Page 4 - Pizza & Pasta', category: 'mains' },
                { src: 'images/menu-food-5.jpg', alt: 'Food Menu Page 5 - Desserts & Drinks', category: 'desserts' }
            ]
        },
        alcohol: {
            title: "Alcohol Specials",
            pages: [
                { src: 'images/menu-alcohol-1.jpg', alt: 'Alcohol Menu Page 1 - Cocktails', category: 'cocktails' },
                { src: 'images/menu-alcohol-2.jpg', alt: 'Alcohol Menu Page 2 - Shooters & Spirits', category: 'spirits' }
            ]
        },
        beers: {
            title: "Beers & Ciders",
            pages: [
                { src: 'images/menu-beers-1.jpg', alt: 'Beers & Ciders Menu', category: 'beers' }
            ]
        },
        spirits: {
            title: "Premium Spirits",
            pages: [
                { src: 'images/menu-spirits-1.jpg', alt: 'Premium Spirits Menu', category: 'spirits' }
            ]
        }
    };

    // State management
    let currentTab = 'food';
    let currentPage = 0;
    let currentCategory = 'all';
    let filteredPages = [];
    let zoomLevel = 1;

    // DOM elements
    const menuContainer = document.querySelector('.menu-container');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const currentPageEl = document.querySelector('.current-page');
    const totalPagesEl = document.querySelector('.total-pages');
    const thumbnailsContainer = document.querySelector('.menu-thumbnails');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const tabContents = document.querySelectorAll('.menu-tab-content');
    const viewBtns = document.querySelectorAll('.view-btn');
    const textMenus = document.querySelectorAll('.text-menu');
    const menuViewers = document.querySelectorAll('.menu-viewer');

    // Initialize menu
    function initMenu() {
        loadMenuPages();
        setupEventListeners();
        updateNavigation();
    }

    // Load menu pages for current tab
    function loadMenuPages() {
        const menu = menuData[currentTab];
        if (!menu) return;

        // Filter pages by category
        filteredPages = currentCategory === 'all' 
            ? menu.pages 
            : menu.pages.filter(page => page.category === currentCategory);

        // Clear container
        menuContainer.innerHTML = '';
        
        if (filteredPages.length === 0) {
            menuContainer.innerHTML = `
                <div class="menu-loading">
                    <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <div>No menu pages found for this category</div>
                </div>
            `;
            return;
        }

        // Create page elements
        filteredPages.forEach((page, index) => {
            const pageEl = document.createElement('div');
            pageEl.className = `menu-page ${getPagePosition(index)}`;
            pageEl.innerHTML = `
                <img src="${page.src}" alt="${page.alt}" loading="lazy" 
                     onerror="this.src='images/placeholder-menu.jpg'">
            `;
            menuContainer.appendChild(pageEl);
        });

        // Reset to first page
        currentPage = 0;
        updatePageDisplay();
        createThumbnails();
    }

    // Get CSS class for page position
    function getPagePosition(index) {
        if (filteredPages.length === 1) return 'center';
        
        if (index === currentPage) return 'center';
        if (index === currentPage - 1) return 'left';
        if (index === currentPage + 1) return 'right';
        
        return 'hidden';
    }

    // Update page display
    function updatePageDisplay() {
        const pages = document.querySelectorAll('.menu-page');
        pages.forEach((page, index) => {
            page.className = `menu-page ${getPagePosition(index)}`;
            
            // Apply zoom
            if (index === currentPage) {
                page.style.transform = `scale(${zoomLevel}) ${getTransform(index)}`;
            } else {
                page.style.transform = getTransform(index);
            }
        });

        // Update page indicator
        currentPageEl.textContent = currentPage + 1;
        totalPagesEl.textContent = filteredPages.length;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentPage);
        });

        updateNavigation();
    }

    // Get transform for page position
    function getTransform(index) {
        if (filteredPages.length === 1) return 'translateZ(0)';
        
        if (index === currentPage) return 'translateZ(0)';
        if (index === currentPage - 1) return 'rotateY(-5deg) translateZ(-1px)';
        if (index === currentPage + 1) return 'rotateY(5deg) translateZ(-1px)';
        
        return 'translateX(100px) scale(0.8)';
    }

    // Create thumbnails
    function createThumbnails() {
        thumbnailsContainer.innerHTML = '';
        
        filteredPages.forEach((page, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === currentPage ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${page.src}" alt="Page ${index + 1}" loading="lazy">`;
            thumb.addEventListener('click', () => goToPage(index));
            thumbnailsContainer.appendChild(thumb);
        });
    }

    // Navigation functions
    function goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < filteredPages.length) {
            currentPage = pageIndex;
            updatePageDisplay();
        }
    }

    function nextPage() {
        if (currentPage < filteredPages.length - 1) {
            currentPage++;
            updatePageDisplay();
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePageDisplay();
        }
    }

    // Update navigation buttons state
    function updateNavigation() {
        if (prevBtn) prevBtn.disabled = currentPage === 0;
        if (nextBtn) nextBtn.disabled = currentPage === filteredPages.length - 1;
    }

    // Zoom functionality
    function zoomIn() {
        if (zoomLevel < 2) {
            zoomLevel += 0.1;
            updatePageDisplay();
        }
    }

    function zoomOut() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.1;
            updatePageDisplay();
        }
    }

    function resetZoom() {
        zoomLevel = 1;
        updatePageDisplay();
    }

    // View mode toggle
    function toggleViewMode(mode) {
        // Update view buttons
        viewBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Show/hide appropriate content
        if (mode === 'images') {
            textMenus.forEach(menu => menu.classList.remove('active'));
            menuViewers.forEach(viewer => viewer.classList.add('active'));
        } else {
            textMenus.forEach(menu => menu.classList.add('active'));
            menuViewers.forEach(viewer => viewer.classList.remove('active'));
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', prevPage);
        if (nextBtn) nextBtn.addEventListener('click', nextPage);

        // Category buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = category;
                loadMenuPages();
            });
        });

        // Tab buttons
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                // Load new tab data
                currentTab = tabId;
                currentCategory = 'all';
                currentPage = 0;
                zoomLevel = 1;
                
                // Reset category buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                categoryBtns[0].classList.add('active');
                
                loadMenuPages();
            });
        });

        // View mode buttons
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.getAttribute('data-view');
                toggleViewMode(mode);
            });
        });

        // Action buttons
        document.getElementById('zoomIn')?.addEventListener('click', zoomIn);
        document.getElementById('zoomOut')?.addEventListener('click', zoomOut);
        document.getElementById('downloadMenu')?.addEventListener('click', downloadMenu);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevPage();
            if (e.key === 'ArrowRight') nextPage();
            if (e.key === 'Escape') resetZoom();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        menuContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        menuContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextPage();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevPage();
            }
        }

        // Double click to zoom
        menuContainer.addEventListener('dblclick', (e) => {
            if (zoomLevel === 1) {
                zoomIn();
            } else {
                resetZoom();
            }
        });
    }

    // Download menu as PDF
    function downloadMenu() {
        const currentImage = filteredPages[currentPage];
        if (!currentImage) return;

        const link = document.createElement('a');
        link.href = currentImage.src;
        link.download = `eatery-menu-${currentTab}-page-${currentPage + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Initialize the menu
    initMenu();
});