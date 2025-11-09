/* ==========================================
   IZZAD.STUDIO - PHOTOGRAPHY BOOK MODULE
   Wedding & Engagement Photography Showcase
   ========================================== */

// Photography data - Wedding & Engagement moments
const photographyData = [
    {
        id: 1,
        src: '/assets/photography/wedding-01.jpg',
        alt: 'intimate wedding ceremony moment',
        caption: 'we freeze moments. you keep them forever.'
    },
    {
        id: 2,
        src: '/assets/photography/engagement-01.jpg',
        alt: 'engagement portrait in natural light',
        caption: 'love stories told through light and shadow.'
    },
    {
        id: 3,
        src: '/assets/photography/wedding-02.jpg',
        alt: 'wedding reception celebration',
        caption: 'joy captured in black & white, remembered in full color.'
    },
    {
        id: 4,
        src: '/assets/photography/engagement-02.jpg',
        alt: 'couple portraits at golden hour',
        caption: 'fleeting sunsets, lasting memories.'
    },
    {
        id: 5,
        src: '/assets/photography/wedding-03.jpg',
        alt: 'wedding ceremony emotional moment',
        caption: 'tears of joy, frozen in time.'
    },
    {
        id: 6,
        src: '/assets/photography/engagement-03.jpg',
        alt: 'engagement session outdoor setting',
        caption: 'before the vows, during the promise.'
    },
    {
        id: 7,
        src: '/assets/photography/wedding-04.jpg',
        alt: 'wedding couple portrait',
        caption: 'two souls, one frame.'
    },
    {
        id: 8,
        src: '/assets/photography/engagement-04.jpg',
        alt: 'intimate engagement moment',
        caption: 'the beginning of forever.'
    }
];

class PhotoBook {
    constructor() {
        this.currentPage = 0;
        this.totalPages = photographyData.length;
        this.isFlipping = false;
        
        // DOM elements
        this.pageLeft = document.getElementById('pageLeft');
        this.pageRight = document.getElementById('pageRight');
        this.pageFlipping = document.getElementById('pageFlipping');
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.currentPageDisplay = document.getElementById('currentPage');
        this.totalPagesDisplay = document.getElementById('totalPages');
        this.caption = document.getElementById('photoCaption');
        
        this.init();
    }
    
    init() {
        if (!this.pageLeft || !this.pageRight) {
            console.warn('Photo book elements not found');
            return;
        }
        
        // Set initial state
        this.totalPagesDisplay.textContent = this.totalPages;
        this.updatePages();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });
        
        // Touch/swipe support
        this.setupTouchControls();
    }
    
    updatePages() {
        // Left page
        const leftIndex = this.currentPage === 0 ? this.totalPages - 1 : this.currentPage - 1;
        this.setPageImage(this.pageLeft, leftIndex);
        
        // Right page (current)
        this.setPageImage(this.pageRight, this.currentPage);
        
        // Update counter
        this.currentPageDisplay.textContent = this.currentPage + 1;
        
        // Update caption
        this.updateCaption(this.currentPage);
        
        // Update button states
        this.updateButtonStates();
    }
    
    setPageImage(pageElement, index) {
        const photo = photographyData[index];
        const img = pageElement.querySelector('.photo-book__image');
        
        if (img && photo) {
            img.src = photo.src;
            img.alt = photo.alt;
        }
    }
    
    updateCaption(index) {
        const photo = photographyData[index];
        if (this.caption && photo) {
            const captionText = this.caption.querySelector('.photography__caption-text');
            if (captionText) {
                captionText.textContent = photo.caption;
            }
        }
    }
    
    updateButtonStates() {
        // Always allow cycling in a loop
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
    }
    
    nextPage() {
        if (this.isFlipping) return;
        
        this.isFlipping = true;
        
        // Prepare flipping page
        const nextIndex = (this.currentPage + 1) % this.totalPages;
        this.setPageImage(this.pageFlipping, this.currentPage);
        
        // Set back of flipping page to next image
        const backImg = this.pageFlipping.querySelector('.photo-book__content--back .photo-book__image');
        const nextPhoto = photographyData[nextIndex];
        if (backImg && nextPhoto) {
            backImg.src = nextPhoto.src;
            backImg.alt = nextPhoto.alt;
        }
        
        // Trigger flip animation
        this.pageFlipping.classList.add('is-flipping');
        
        // Update after animation
        setTimeout(() => {
            this.currentPage = nextIndex;
            this.updatePages();
            this.pageFlipping.classList.remove('is-flipping');
            this.isFlipping = false;
        }, 1200); // Match CSS transition duration
    }
    
    previousPage() {
        if (this.isFlipping) return;
        
        this.isFlipping = true;
        
        // Prepare flipping page (reverse)
        const prevIndex = this.currentPage === 0 ? this.totalPages - 1 : this.currentPage - 1;
        
        // Set flipping page to show previous image when flipped back
        this.setPageImage(this.pageFlipping, prevIndex);
        
        // Set back to current image
        const backImg = this.pageFlipping.querySelector('.photo-book__content--back .photo-book__image');
        const currentPhoto = photographyData[this.currentPage];
        if (backImg && currentPhoto) {
            backImg.src = currentPhoto.src;
            backImg.alt = currentPhoto.alt;
        }
        
        // Start with flipped state
        this.pageFlipping.style.transition = 'none';
        this.pageFlipping.classList.add('is-flipping');
        
        // Force reflow
        this.pageFlipping.offsetHeight;
        
        // Re-enable transition and flip back
        setTimeout(() => {
            this.pageFlipping.style.transition = '';
            this.pageFlipping.classList.remove('is-flipping');
        }, 20);
        
        // Update after animation
        setTimeout(() => {
            this.currentPage = prevIndex;
            this.updatePages();
            this.isFlipping = false;
        }, 1200);
    }
    
    setupTouchControls() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const photoBook = document.getElementById('photoBook');
        if (!photoBook) return;
        
        photoBook.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        photoBook.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next page
                    this.nextPage();
                } else {
                    // Swipe right - previous page
                    this.previousPage();
                }
            }
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PhotoBook();
    });
} else {
    new PhotoBook();
}
