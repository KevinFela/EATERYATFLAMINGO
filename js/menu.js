// Menu page specific functionality - Text Only Version
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const tabContents = document.querySelectorAll('.menu-tab-content');
    const textMenus = document.querySelectorAll('.text-menu');

    // State management
    let currentTab = 'food';

    // Initialize menu
    function initMenu() {
        setupEventListeners();
        // Ensure first tab is active on load
        activateTab('food');
    }

    // Activate a specific tab
    function activateTab(tabId) {
        // Update active tab button
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active tab content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Update current tab
        currentTab = tabId;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Tab buttons
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                activateTab(tabId);
            });
        });

        // Keyboard navigation for tabs
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const tabs = ['food', 'alcohol', 'beers', 'spirits'];
                const currentIndex = tabs.indexOf(currentTab);
                
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    activateTab(tabs[currentIndex - 1]);
                } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
                    activateTab(tabs[currentIndex + 1]);
                } else if (e.key >= '1' && e.key <= '4') {
                    const tabIndex = parseInt(e.key) - 1;
                    if (tabIndex < tabs.length) {
                        activateTab(tabs[tabIndex]);
                    }
                }
            }
        });

        // Add smooth scrolling to menu sections
        document.querySelectorAll('.menu-category h3').forEach(heading => {
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', () => {
                heading.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Add WhatsApp ordering functionality
        addWhatsAppOrdering();
    }

    // Add WhatsApp ordering buttons to menu items
    function addWhatsAppOrdering() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemName = item.querySelector('.menu-item-name').textContent;
            const itemPrice = item.querySelector('.menu-item-price').textContent;
            
            // Create WhatsApp order button
            const whatsappBtn = document.createElement('a');
            whatsappBtn.className = 'btn btn-whatsapp';
            whatsappBtn.style.cssText = 'width: auto; margin-top: 10px; padding: 8px 16px; font-size: 14px;';
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Order Now';
            whatsappBtn.href = `https://wa.me/27621369848?text=${encodeURIComponent(`Hi Eatery at Flamingo! I'd like to order: ${itemName} - ${itemPrice}`)}`;
            whatsappBtn.target = '_blank';
            
            // Add button to menu item
            item.appendChild(whatsappBtn);
        });
    }

    // Utility function to format prices for display
    function formatPrice(price) {
        return price.replace('R', 'R ');
    }

    // Initialize price formatting
    function formatAllPrices() {
        const prices = document.querySelectorAll('.menu-item-price');
        prices.forEach(priceEl => {
            const originalPrice = priceEl.textContent;
            priceEl.textContent = formatPrice(originalPrice);
        });
    }

    // Add category navigation
    function addCategoryNavigation() {
        const categories = document.querySelectorAll('.menu-category');
        const navContainer = document.createElement('div');
        navContainer.className = 'category-navigation';
        navContainer.style.cssText = 'position: sticky; top: 140px; background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 24px; z-index: 99; border: 1px solid #e0e0e0;';
        
        const navTitle = document.createElement('h4');
        navTitle.textContent = 'Quick Navigation';
        navTitle.style.marginBottom = '10px';
        navTitle.style.color = 'var(--text-primary)';
        navContainer.appendChild(navTitle);
        
        const navList = document.createElement('div');
        navList.style.display = 'flex';
        navList.style.flexWrap = 'wrap';
        navList.style.gap = '8px';
        
        categories.forEach(category => {
            const categoryName = category.querySelector('h3').textContent;
            const navButton = document.createElement('button');
            navButton.className = 'category-nav-btn';
            navButton.textContent = categoryName;
            navButton.style.cssText = 'padding: 10px 16px; background: var(--secondary-light); border: 1px solid var(--border-color); border-radius: 20px; cursor: pointer; transition: all 0.3s ease; font-size: 13px; white-space: nowrap; font-weight: 600;';
            
            navButton.addEventListener('click', () => {
                category.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add active state
                document.querySelectorAll('.category-nav-btn').forEach(btn => {
                    btn.style.background = 'var(--secondary-light)';
                    btn.style.color = 'var(--text-primary)';
                });
                navButton.style.background = 'var(--accent-pink)';
                navButton.style.color = 'white';
            });
            
            navButton.addEventListener('mouseenter', () => {
                if (navButton.style.background !== 'var(--accent-pink)') {
                    navButton.style.background = 'var(--accent-pink-light)';
                    navButton.style.color = 'white';
                }
            });
            
            navButton.addEventListener('mouseleave', () => {
                if (navButton.style.background !== 'var(--accent-pink)') {
                    navButton.style.background = 'var(--secondary-light)';
                    navButton.style.color = 'var(--text-primary)';
                }
            });
            
            navList.appendChild(navButton);
        });
        
        navContainer.appendChild(navList);
        
        // Insert after menu tabs
        const menuTabs = document.querySelector('.menu-tabs');
        if (menuTabs) {
            menuTabs.parentNode.insertBefore(navContainer, menuTabs.nextSibling);
        }
    }

    // Add search functionality
    function addSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'menu-search';
        searchContainer.style.cssText = 'margin: 32px 0; position: sticky; top: 140px; background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); z-index: 99; border: 1px solid #e0e0e0;';
        
        searchContainer.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center;">
                <i class="fas fa-search" style="color: var(--accent-pink); font-size: 18px;"></i>
                <input type="text" id="menuSearch" placeholder="Search menu items..." 
                       style="flex: 1; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 15px; transition: all 0.3s ease;">
                <button id="clearSearch" style="padding: 12px 20px; background: var(--text-muted); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s ease;">
                    Clear
                </button>
            </div>
        `;
        
        // Insert before menu highlights
        const menuHighlights = document.querySelector('.menu-highlights');
        if (menuHighlights) {
            menuHighlights.parentNode.insertBefore(searchContainer, menuHighlights);
        }
        
        // Add search functionality
        const searchInput = document.getElementById('menuSearch');
        const clearButton = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterMenuItems(searchTerm);
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            filterMenuItems('');
        });

        // Add focus styles
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent-pink)';
            this.style.boxShadow = '0 0 0 3px rgba(255, 0, 127, 0.1)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });

        clearButton.addEventListener('mouseenter', function() {
            if (searchInput.value) {
                this.style.background = 'var(--accent-pink)';
            }
        });

        clearButton.addEventListener('mouseleave', function() {
            this.style.background = 'var(--text-muted)';
        });
    }

    // Filter menu items based on search term
    function filterMenuItems(searchTerm) {
        const menuItems = document.querySelectorAll('.menu-item');
        const categories = document.querySelectorAll('.menu-category');
        
        let hasVisibleItems = false;
        
        categories.forEach(category => {
            const categoryItems = category.querySelectorAll('.menu-item');
            let categoryHasVisibleItems = false;
            
            categoryItems.forEach(item => {
                const itemName = item.querySelector('.menu-item-name').textContent.toLowerCase();
                const itemDescription = item.querySelector('.menu-item-description')?.textContent.toLowerCase() || '';
                
                if (searchTerm === '' || itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                    item.style.display = 'block';
                    categoryHasVisibleItems = true;
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide category based on whether it has visible items
            category.style.display = categoryHasVisibleItems ? 'block' : 'none';
        });
        
        // Show message if no results
        showNoResultsMessage(!hasVisibleItems && searchTerm !== '');
    }

    // Show/hide no results message
    function showNoResultsMessage(show) {
        let message = document.getElementById('noResultsMessage');
        
        if (show && !message) {
            message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 64px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 24px; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 16px; color: var(--text-secondary);">No items found</h3>
                    <p style="color: var(--text-muted); font-size: 1rem;">Try searching with different keywords</p>
                </div>
            `;
            
            const activeTab = document.querySelector('.menu-tab-content.active');
            if (activeTab) {
                activeTab.appendChild(message);
            }
        } else if (!show && message) {
            message.remove();
        }
    }

    // Add print functionality
    function addPrintFunctionality() {
        const printButton = document.createElement('button');
        printButton.className = 'btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Menu';
        printButton.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 1000; background: var(--accent-pink); color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 0, 127, 0.3); transition: all 0.3s ease;';
        
        printButton.addEventListener('click', function() {
            window.print();
        });

        printButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(255, 0, 127, 0.4)';
        });

        printButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(255, 0, 127, 0.3)';
        });
        
        document.body.appendChild(printButton);
        
        // Add print styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                header, footer, .menu-highlights, .menu-tabs, .category-navigation, .menu-search, .btn, .no-results-message {
                    display: none !important;
                }
                
                .menu-section {
                    padding: 20px 0 !important;
                }
                
                .menu-category {
                    break-inside: avoid;
                    margin-bottom: 30px;
                    box-shadow: none !important;
                    border: 1px solid #ddd !important;
                }
                
                .menu-item {
                    border: 1px solid #ddd !important;
                    break-inside: avoid;
                    box-shadow: none !important;
                }
                
                body {
                    font-size: 12pt;
                    line-height: 1.4;
                }
                
                .menu-item-price {
                    color: #000 !important;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }

    // Initialize enhanced features
    function initEnhancedFeatures() {
        formatAllPrices();
        addCategoryNavigation();
        addSearchFunctionality();
        addPrintFunctionality();
    }

    // Initialize everything
    initMenu();
    initEnhancedFeatures();

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        // Adjust category navigation for mobile
        const categoryNav = document.querySelector('.category-navigation');
        if (categoryNav) {
            if (window.innerWidth < 768) {
                categoryNav.style.position = 'static';
            } else {
                categoryNav.style.position = 'sticky';
            }
        }
    });
});