// Fully Automated Reviews System
// Zero manual work - reviews appear automatically

class AutomatedReviews {
    constructor() {
        this.reviews = [];
        this.init();
    }

    async init() {
        await this.loadReviews();
        this.displayReviews();
        this.setupFormHandler();
        this.setupModalHandlers();
        this.setupStarRating();
    }

    async loadReviews() {
        try {
            // Try to load from Netlify function
            const response = await fetch('/.netlify/functions/reviews');
            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
                console.log('Loaded reviews from database:', this.reviews.length);
            } else {
                throw new Error('Function not available');
            }
        } catch (error) {
            console.log('Using fallback reviews');
            // Fallback to default reviews
            this.reviews = [
                {
                    name: 'Sarah Ahmed',
                    service: 'IV Medication',
                    message: 'Excellent service! The nurse was very professional and made me feel comfortable throughout the treatment.',
                    rating: 5,
                    date: '2024-06-15'
                },
                {
                    name: 'Muhammad Ali',
                    service: 'Blood Test',
                    message: 'Quick and efficient service. Very satisfied with the home visit.',
                    rating: 5,
                    date: '2024-06-10'
                },
                {
                    name: 'Fatima Khan',
                    service: 'IV Line',
                    message: 'Professional staff and excellent care. Highly recommended!',
                    rating: 5,
                    date: '2024-06-05'
                }
            ];
        }
    }

    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        testimonialTrack.innerHTML = '';

        // Sort by date (newest first)
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedReviews.forEach((review) => {
            this.addReviewToDOM(review);
        });

        this.initializeSlider();
        console.log('Displayed', sortedReviews.length, 'reviews');
    }

    addReviewToDOM(review) {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'testimonial';
        testimonialDiv.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-text">
                    <p>"${review.message}"</p>
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

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        return stars;
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
            message: formData.get('reviewMessage').trim(),
        };

        if (!this.validateReview(reviewData)) {
            this.showStatus('Please fill in all fields correctly.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Submit to Netlify function
            const response = await fetch('/.netlify/functions/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                const result = await response.json();
                
                // Add the new review to display immediately
                this.reviews.unshift(result.review);
                this.displayReviews();

                this.showStatus('Thank you! Your review has been added successfully.', 'success');
                form.reset();
                this.resetStarRating();
                this.closeModal();

                console.log('Review added successfully:', result.review);
            } else {
                throw new Error('Failed to submit review');
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            
            // Fallback: still submit to Netlify Forms for email notification
            try {
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });
                
                this.showStatus('Review submitted! It may take a few minutes to appear.', 'success');
                form.reset();
                this.resetStarRating();
                this.closeModal();
            } catch (fallbackError) {
                this.showStatus('Error submitting review. Please try again.', 'error');
            }
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateReview(data) {
        return data.name && 
               data.email && 
               data.service && 
               data.rating >= 1 && 
               data.rating <= 5 && 
               data.message &&
               this.isValidEmail(data.email);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

    initializeSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        let currentSlide = 0;
        const totalSlides = testimonials.length;

        const showSlide = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        };

        showSlide(0);

        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(currentSlide);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            });
        }

        // Auto-advance every 6 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 6000);
    }

    // Refresh reviews (can be called periodically)
    async refreshReviews() {
        await this.loadReviews();
        this.displayReviews();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Automated Reviews System');
    window.homeaidReviews = new AutomatedReviews();
    
    // Refresh reviews every 5 minutes to show new ones
    setInterval(() => {
        if (window.homeaidReviews) {
            window.homeaidReviews.refreshReviews();
        }
    }, 300000); // 5 minutes
});
