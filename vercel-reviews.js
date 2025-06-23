// Enhanced Vercel Reviews System with Beautiful UI and Auto-scroll
// Reviews appear automatically with smooth transitions and auto-rotation

class VercelReviews {
    constructor() {
        this.reviews = [];
        this.apiUrl = '/api/reviews';
        this.currentSlide = 0;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 12000; // 12 seconds between slides
        this.isTransitioning = false;
        this.init();
    }

    async init() {
        await this.loadReviews();
        this.displayReviews();
        this.setupFormHandler();
        this.setupModalHandlers();
        this.setupStarRating();
        this.startAutoScroll();
        
        // Auto-refresh reviews every 2 minutes to show new ones
        setInterval(() => {
            this.refreshReviews();
        }, 120000);
    }

    async loadReviews() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
                console.log('Loaded reviews from Vercel KV:', this.reviews.length);
            } else {
                throw new Error('API not available - using fallback reviews');
            }
        } catch (error) {
            console.log('API not available, using fallback reviews:', error.message);
            this.reviews = this.getFallbackReviews();
        }

        // Ensure we always have reviews to display
        if (this.reviews.length === 0) {
            this.reviews = this.getFallbackReviews();
        }
    }

    getFallbackReviews() {
        return [
            {
                name: 'Sarah Ahmed',
                service: 'IV Medication',
                message: 'Excellent service! The nurse was very professional and made me feel comfortable throughout the treatment. The staff arrived on time and handled everything with great care.',
                rating: 5,
                date: '2024-06-15'
            },
            {
                name: 'Muhammad Ali',
                service: 'Blood Test',
                message: 'Quick and efficient service. Very satisfied with the home visit. The convenience of having medical services at home is incredible.',
                rating: 5,
                date: '2024-06-10'
            },
            {
                name: 'Fatima Khan',
                service: 'IV Line',
                message: 'Professional staff and excellent care. Highly recommended! They made the whole process stress-free and comfortable.',
                rating: 5,
                date: '2024-06-05'
            },
            {
                name: 'Ahmed Hassan',
                service: 'Nursing Care',
                message: 'Outstanding nursing care for my elderly mother. The team was compassionate, skilled, and treated her with dignity and respect.',
                rating: 5,
                date: '2024-06-01'
            }
        ];
    }

    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) {
            console.log('Testimonial track not found');
            return;
        }

        testimonialTrack.innerHTML = '';

        // Sort by date (newest first)
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedReviews.length === 0) {
            console.log('No reviews to display');
            return;
        }

        // Create testimonial elements
        sortedReviews.forEach((review, index) => {
            this.addReviewToDOM(review, index);
        });

        // Create navigation controls
        this.createNavigationControls(sortedReviews.length);

        // Initialize slider
        this.initializeSlider();
        
        console.log('Displayed', sortedReviews.length, 'reviews with enhanced UI');
    }

    addReviewToDOM(review, index) {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = `testimonial ${index === 0 ? 'active' : ''}`;
        testimonialDiv.setAttribute('data-index', index);
        
        testimonialDiv.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-text">
                    <p>${review.message}</p>
                </div>
                <div class="testimonial-author">
                    <h4>${review.name}</h4>
                    <p>${review.service}</p>
                    <div class="rating">
                        ${this.generateStars(review.rating)}
                    </div>
                </div>
            </div>
        `;
        testimonialTrack.appendChild(testimonialDiv);
    }

    createNavigationControls(count) {
        // Remove existing controls
        const existingControls = document.querySelector('.testimonial-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // Create navigation controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'testimonial-controls';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'testimonial-nav prev-testimonial';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.previousSlide());

        // Progress indicators
        const progressContainer = document.createElement('div');
        progressContainer.className = 'testimonial-progress';

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            progressContainer.appendChild(dot);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'testimonial-nav next-testimonial';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Add all controls to container
        controlsContainer.appendChild(prevBtn);
        controlsContainer.appendChild(progressContainer);
        controlsContainer.appendChild(nextBtn);

        // Insert controls before the add review button
        const addReviewBtn = document.querySelector('.add-review-btn');
        if (addReviewBtn) {
            addReviewBtn.parentNode.insertBefore(controlsContainer, addReviewBtn);
        }
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        return stars;
    }

    initializeSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) {
            console.log('No testimonials found for slider');
            return;
        }

        // Add auto-scroll indicator
        this.addAutoScrollIndicator();

        // Show first slide
        this.currentSlide = 0;
        this.showSlide(0);

        console.log('Slider initialized with', testimonials.length, 'slides');
    }

    addAutoScrollIndicator() {
        const slider = document.querySelector('.testimonial-slider');
        if (!slider || slider.querySelector('.auto-scroll-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'auto-scroll-indicator';
        indicator.innerHTML = '<i class="fas fa-play"></i> Auto';
        slider.appendChild(indicator);
    }

    showSlide(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        const progressDots = document.querySelectorAll('.progress-dot');
        
        if (testimonials.length === 0) return;

        // Hide all testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });

        // Update progress dots
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
        console.log('Showing slide:', index);
    }

    startAutoScroll() {
        this.stopAutoScroll(); // Clear any existing interval
        
        this.autoScrollInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoScrollDelay);
    }

    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    nextSlide() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        const nextIndex = (this.currentSlide + 1) % testimonials.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        const prevIndex = (this.currentSlide - 1 + testimonials.length) % testimonials.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;

        const testimonials = document.querySelectorAll('.testimonial');
        
        if (testimonials.length === 0 || index >= testimonials.length) return;

        this.isTransitioning = true;

        // Show the selected slide
        this.showSlide(index);

        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);

        // Restart auto-scroll
        this.startAutoScroll();
    }

    setupFormHandler() {
        const reviewForm = document.getElementById('reviewForm');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(e);
        });
    }

    async handleFormSubmission(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const reviewData = {
            name: formData.get('reviewName').trim(),
            email: formData.get('reviewEmail').trim(),
            service: formData.get('reviewService'),
            rating: parseInt(formData.get('reviewRating')),
            message: formData.get('reviewMessage').trim()
        };

        if (!this.validateReview(reviewData)) {
            this.showStatus('Please fill in all fields correctly.', 'error');
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                const result = await response.json();
                
                // Add the new review to the beginning of the array
                this.reviews.unshift(result.review);
                
                // Refresh the display with the new review
                this.displayReviews();
                
                // Go to the first slide to show the new review
                setTimeout(() => {
                    this.goToSlide(0);
                }, 100);

                this.showStatus('Thank you! Your review has been added and is now live on the website.', 'success');
                form.reset();
                this.resetStarRating();
                this.closeModal();

                console.log('New review added and displayed:', result.review);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit review');
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showStatus('Error submitting review: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateReview(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return data.name && 
               data.email && 
               emailRegex.test(data.email) &&
               data.service && 
               data.rating >= 1 && 
               data.rating <= 5 && 
               data.message;
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('review-status');
        if (!statusDiv) return;

        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 6000);
    }

    setupModalHandlers() {
        const openBtn = document.getElementById('openReviewForm');
        const modal = document.getElementById('reviewModal');
        const closeBtn = document.querySelector('.close-modal');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                // Pause auto-scroll when modal is open
                this.stopAutoScroll();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.style.display = 'none';
            // Resume auto-scroll when modal is closed
            this.startAutoScroll();
        }
    }

    setupStarRating() {
        const stars = document.querySelectorAll('.rating-input i');
        const ratingInput = document.getElementById('reviewRating');
        
        if (!stars.length || !ratingInput) return;
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.getAttribute('data-rating'));
                ratingInput.value = rating;
                this.updateStarDisplay(rating);
            });
        });
    }

    updateStarDisplay(rating) {
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach((star, index) => {
            star.className = index < rating ? 'fas fa-star' : 'far fa-star';
        });
    }

    resetStarRating() {
        const ratingInput = document.getElementById('reviewRating');
        if (ratingInput) {
            ratingInput.value = '0';
            this.updateStarDisplay(0);
        }
    }

    // Refresh reviews without disrupting the current slide
    async refreshReviews() {
        const oldCount = this.reviews.length;
        await this.loadReviews();
        
        if (this.reviews.length > oldCount) {
            // New reviews detected - refresh display
            const currentIndex = this.currentSlide;
            this.displayReviews();
            
            // Restore current slide position if possible
            setTimeout(() => {
                if (currentIndex < this.reviews.length) {
                    this.goToSlide(currentIndex);
                }
            }, 100);
            
            console.log('New reviews detected and added to rotation');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Enhanced Vercel Reviews System');
    window.homeaidReviews = new VercelReviews();
});
