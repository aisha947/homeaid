// Clean Professional Reviews System
// Simple, reliable, and matches your site design

class CleanReviews {
    constructor() {
        this.reviews = [
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
        
        this.currentSlide = 0;
        this.autoScrollInterval = null;
        this.autoScrollDelay = 12000; // 12 seconds
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Clean Reviews System');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('🎯 Setting up reviews...');
        
        this.displayReviews();
        this.createControls();
        this.setupFormHandler();
        this.setupModalHandlers();
        this.setupStarRating();
        this.startAutoScroll();
        
        console.log('✅ Clean Reviews System ready!');
    }

    displayReviews() {
        const track = document.querySelector('.testimonial-track');
        if (!track) {
            console.error('❌ Testimonial track not found');
            return;
        }

        console.log('🎨 Creating review elements...');
        track.innerHTML = '';

        this.reviews.forEach((review, index) => {
            const reviewElement = document.createElement('div');
            reviewElement.className = `testimonial ${index === 0 ? 'active' : ''}`;
            reviewElement.innerHTML = `
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
            track.appendChild(reviewElement);
        });

        // Add auto-scroll indicator
        const slider = document.querySelector('.testimonial-slider');
        if (slider && !slider.querySelector('.auto-scroll-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'auto-scroll-indicator';
            indicator.innerHTML = '<i class="fas fa-play"></i> Auto';
            slider.appendChild(indicator);
        }

        console.log(`✅ Created ${this.reviews.length} review elements`);
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        return stars;
    }

    createControls() {
        // Remove existing controls
        const existingControls = document.querySelector('.testimonial-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // Create new controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'testimonial-controls';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'testimonial-nav prev-testimonial';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.previousSlide());

        // Progress dots
        const progressContainer = document.createElement('div');
        progressContainer.className = 'testimonial-progress';

        for (let i = 0; i < this.reviews.length; i++) {
            const dot = document.createElement('div');
            dot.className = `progress-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            progressContainer.appendChild(dot);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'testimonial-nav next-testimonial';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Add all to container
        controlsContainer.appendChild(prevBtn);
        controlsContainer.appendChild(progressContainer);
        controlsContainer.appendChild(nextBtn);

        // Insert before the add review button
        const addReviewBtn = document.querySelector('.add-review-btn');
        if (addReviewBtn && addReviewBtn.parentNode) {
            addReviewBtn.parentNode.insertBefore(controlsContainer, addReviewBtn);
        }

        console.log('🎮 Navigation controls created');
    }

    showSlide(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        const progressDots = document.querySelectorAll('.progress-dot');
        
        if (testimonials.length === 0) return;

        // Update testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });

        // Update progress dots
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
        console.log(`📍 Showing slide ${index + 1} of ${testimonials.length}`);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.reviews.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.reviews.length) % this.reviews.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.showSlide(index);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);

        // Restart auto-scroll
        this.startAutoScroll();
    }

    startAutoScroll() {
        this.stopAutoScroll();
        
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

    setupFormHandler() {
        const reviewForm = document.getElementById('reviewForm');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const reviewData = {
                name: formData.get('reviewName').trim(),
                email: formData.get('reviewEmail').trim(),
                service: formData.get('reviewService'),
                rating: parseInt(formData.get('reviewRating')),
                message: formData.get('reviewMessage').trim(),
                date: new Date().toISOString().split('T')[0]
            };

            if (!this.validateReview(reviewData)) {
                this.showStatus('Please fill in all fields correctly.', 'error');
                return;
            }

            const submitBtn = e.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                // Try to submit to Vercel API
                const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    console.log('✅ Review submitted to API');
                } else {
                    console.log('⚠️ API not available, adding locally');
                }
            } catch (error) {
                console.log('⚠️ API error, adding locally:', error.message);
            }

            // Add review to display immediately
            this.reviews.unshift(reviewData);
            this.displayReviews();
            this.createControls();
            this.goToSlide(0);

            this.showStatus('Thank you! Your review has been added successfully.', 'success');
            e.target.reset();
            this.resetStarRating();
            this.closeModal();

            console.log('✅ Review added:', reviewData.name);

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
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
        }, 5000);
    }

    setupModalHandlers() {
        const openBtn = document.getElementById('openReviewForm');
        const modal = document.getElementById('reviewModal');
        const closeBtn = document.querySelector('.close-modal');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'block';
                this.stopAutoScroll(); // Pause auto-scroll when modal opens
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.style.display = 'none';
            this.startAutoScroll(); // Resume auto-scroll when modal closes
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
}

// Initialize the clean reviews system
window.cleanReviews = new CleanReviews();
