// Netlify Moderated Reviews System
// This system stores reviews in localStorage temporarily and uses Netlify Forms for submission

class NetlifyModeratedReviews {
    constructor() {
        this.reviews = this.loadApprovedReviews();
        this.pendingReviews = this.loadPendingReviews();
        this.init();
    }

    init() {
        this.displayReviews();
        this.setupFormHandler();
        this.setupModalHandlers();
    }

    // Load approved reviews from reviews.json
    loadApprovedReviews() {
        try {
            // In a real scenario, this would be loaded from your reviews.json file
            // For now, return default reviews
            return [
                {
                    id: 'default-1',
                    name: 'Sarah Ahmed',
                    service: 'IV Medication',
                    message: 'Excellent service! The nurse was very professional and made me feel comfortable throughout the treatment.',
                    rating: 5,
                    date: '2024-06-15',
                    approved: true
                },
                {
                    id: 'default-2',
                    name: 'Muhammad Ali',
                    service: 'Blood Test',
                    message: 'Quick and efficient service. Very satisfied with the home visit.',
                    rating: 5,
                    date: '2024-06-10',
                    approved: true
                },
                {
                    id: 'default-3',
                    name: 'Fatima Khan',
                    service: 'IV Line',
                    message: 'Professional staff and excellent care. Highly recommended!',
                    rating: 5,
                    date: '2024-06-05',
                    approved: true
                }
            ];
        } catch (error) {
            console.error('Error loading approved reviews:', error);
            return [];
        }
    }

    // Load pending reviews from localStorage
    loadPendingReviews() {
        try {
            const pending = localStorage.getItem('homeaid_pending_reviews');
            return pending ? JSON.parse(pending) : [];
        } catch (error) {
            console.error('Error loading pending reviews:', error);
            return [];
        }
    }

    // Save pending reviews to localStorage
    savePendingReviews() {
        try {
            localStorage.setItem('homeaid_pending_reviews', JSON.stringify(this.pendingReviews));
        } catch (error) {
            console.error('Error saving pending reviews:', error);
        }
    }

    // Display only approved reviews
    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        // Clear existing testimonials except the first few default ones
        testimonialTrack.innerHTML = '';

        // Add approved reviews
        this.reviews.forEach((review, index) => {
            if (review.approved) {
                this.addReviewToDOM(review, index);
            }
        });

        // Reinitialize slider if needed
        if (window.initializeSlider) {
            window.initializeSlider();
        }
    }

    addReviewToDOM(review, index) {
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
            id: 'pending-' + Date.now(),
            name: formData.get('reviewName'),
            email: formData.get('reviewEmail'),
            service: formData.get('reviewService'),
            rating: parseInt(formData.get('reviewRating')),
            message: formData.get('reviewMessage'),
            date: new Date().toISOString().split('T')[0],
            approved: false,
            timestamp: new Date().toISOString()
        };

        // Validate form data
        if (!this.validateReviewData(reviewData)) {
            this.showStatus('Please fill in all required fields correctly.', 'error');
            return;
        }

        try {
            // Submit to Netlify Forms
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                // Store in pending reviews (local storage)
                this.pendingReviews.push(reviewData);
                this.savePendingReviews();

                // Show success message
                this.showStatus('Thank you for your review! It will be published after moderation.', 'success');
                
                // Reset form and close modal
                form.reset();
                this.closeModal();

                // Send admin notification (you'll receive this via Netlify)
                console.log('Review submitted for moderation:', reviewData);

            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showStatus('There was an error submitting your review. Please try again.', 'error');
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

    // Admin function to approve reviews (for your use)
    approveReview(reviewId) {
        const pendingIndex = this.pendingReviews.findIndex(r => r.id === reviewId);
        if (pendingIndex !== -1) {
            const review = this.pendingReviews[pendingIndex];
            review.approved = true;
            
            // Move to approved reviews
            this.reviews.push(review);
            
            // Remove from pending
            this.pendingReviews.splice(pendingIndex, 1);
            this.savePendingReviews();
            
            // Refresh display
            this.displayReviews();
            
            console.log('Review approved:', review);
        }
    }

    // Get pending reviews (for admin panel)
    getPendingReviews() {
        return this.pendingReviews;
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're not already initialized
    if (!window.homeaidReviews) {
        window.homeaidReviews = new NetlifyModeratedReviews();
        
        // Setup star rating functionality
        setupStarRating();
    }
});

function setupStarRating() {
    const stars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
    
    // Reset on mouse leave
    const ratingContainer = document.querySelector('.rating-input');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value) || 0;
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    }
}
