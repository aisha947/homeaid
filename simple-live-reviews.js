// Simple Live Reviews System for HomeAid
// Reviews appear immediately when submitted

class SimpleLiveReviews {
    constructor() {
        this.reviews = this.loadReviews();
        this.init();
    }

    init() {
        this.displayReviews();
        this.setupFormHandler();
        this.setupModalHandlers();
        this.setupStarRating();
    }

    // Load reviews from localStorage and default reviews
    loadReviews() {
        try {
            const stored = localStorage.getItem('homeaid_reviews');
            let reviews = stored ? JSON.parse(stored) : [];
            
            // Add default reviews if none exist
            if (reviews.length === 0) {
                reviews = [
                    {
                        id: 'default-1',
                        name: 'Sarah Ahmed',
                        service: 'IV Medication',
                        message: 'Excellent service! The nurse was very professional and made me feel comfortable throughout the treatment.',
                        rating: 5,
                        date: '2024-06-15'
                    },
                    {
                        id: 'default-2',
                        name: 'Muhammad Ali',
                        service: 'Blood Test',
                        message: 'Quick and efficient service. Very satisfied with the home visit.',
                        rating: 5,
                        date: '2024-06-10'
                    },
                    {
                        id: 'default-3',
                        name: 'Fatima Khan',
                        service: 'IV Line',
                        message: 'Professional staff and excellent care. Highly recommended!',
                        rating: 5,
                        date: '2024-06-05'
                    }
                ];
                this.saveReviews(reviews);
            }
            
            return reviews;
        } catch (error) {
            console.error('Error loading reviews:', error);
            return [];
        }
    }

    // Save reviews to localStorage
    saveReviews(reviews) {
        try {
            localStorage.setItem('homeaid_reviews', JSON.stringify(reviews));
        } catch (error) {
            console.error('Error saving reviews:', error);
        }
    }

    // Display all reviews on the page
    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        // Clear existing content
        testimonialTrack.innerHTML = '';

        // Sort reviews by date (newest first)
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Add each review to the DOM
        sortedReviews.forEach((review, index) => {
            this.addReviewToDOM(review, index);
        });

        // Reinitialize slider if it exists
        this.initializeSlider();
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
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    setupFormHandler() {
        const reviewForm = document.getElementById('reviewForm');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e);
        });
    }

    async handleFormSubmission(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        // Get form values
        const reviewData = {
            id: 'review-' + Date.now(),
            name: formData.get('reviewName').trim(),
            email: formData.get('reviewEmail').trim(),
            service: formData.get('reviewService'),
            rating: parseInt(formData.get('reviewRating')),
            message: formData.get('reviewMessage').trim(),
            date: new Date().toISOString().split('T')[0]
        };

        // Validate form data
        if (!this.validateReviewData(reviewData)) {
            this.showStatus('Please fill in all required fields correctly.', 'error');
            return;
        }

        try {
            // Submit to Netlify Forms (for your records)
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            // Add review immediately to display (regardless of Netlify submission)
            this.reviews.unshift(reviewData); // Add to beginning of array
            this.saveReviews(this.reviews);
            this.displayReviews();

            // Show success message
            this.showStatus('Thank you for your review! It has been added to our testimonials.', 'success');
            
            // Reset form and close modal
            form.reset();
            this.resetStarRating();
            this.closeModal();

            console.log('Review added successfully:', reviewData);

        } catch (error) {
            console.error('Error submitting review:', error);
            
            // Still add the review locally even if Netlify submission fails
            this.reviews.unshift(reviewData);
            this.saveReviews(this.reviews);
            this.displayReviews();
            
            this.showStatus('Your review has been added! (Note: Email notification may have failed)', 'success');
            form.reset();
            this.resetStarRating();
            this.closeModal();
        }
    }

    validateReviewData(data) {
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

        // Hide after 5 seconds
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

        if (closeBtn && modal) {
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
            
            star.addEventListener('mouseover', (e) => {
                const rating = parseInt(e.target.getAttribute('data-rating'));
                this.updateStarDisplay(rating);
            });
        });
        
        // Reset on mouse leave
        const ratingContainer = document.querySelector('.rating-input');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                const currentRating = parseInt(ratingInput.value) || 0;
                this.updateStarDisplay(currentRating);
            });
        }
    }

    updateStarDisplay(rating) {
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.className = 'fas fa-star';
            } else {
                star.className = 'far fa-star';
            }
        });
    }

    resetStarRating() {
        const ratingInput = document.getElementById('reviewRating');
        if (ratingInput) {
            ratingInput.value = '0';
            this.updateStarDisplay(0);
        }
    }

    // Simple slider functionality
    initializeSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');
        
        if (testimonials.length === 0) return;

        let currentSlide = 0;
        const totalSlides = testimonials.length;

        // Show first slide
        this.showSlide(currentSlide);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                this.showSlide(currentSlide);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                this.showSlide(currentSlide);
            });
        }

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            this.showSlide(currentSlide);
        }, 5000);
    }

    showSlide(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!window.homeaidReviews) {
        window.homeaidReviews = new SimpleLiveReviews();
    }
});
