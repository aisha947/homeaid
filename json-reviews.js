// Simple JSON Reviews System
// Most reliable approach for static sites

class JSONReviews {
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
            const response = await fetch('./reviews.json?v=' + Date.now()); // Cache busting
            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
                console.log('Loaded reviews:', this.reviews.length);
            }
        } catch (error) {
            console.log('Could not load reviews.json, using defaults');
            this.reviews = [];
        }

        // Always ensure we have some default reviews
        if (this.reviews.length === 0) {
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
                }
            ];
        }
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

        sortedReviews.forEach((review) => {
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
        });

        this.initializeSlider();
        console.log('Displayed', sortedReviews.length, 'reviews');
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
        if (!reviewForm) {
            console.log('Review form not found');
            return;
        }

        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const reviewData = {
                name: formData.get('reviewName').trim(),
                service: formData.get('reviewService'),
                rating: parseInt(formData.get('reviewRating')),
                message: formData.get('reviewMessage').trim(),
                date: new Date().toISOString().split('T')[0]
            };

            if (!this.validateReview(reviewData)) {
                this.showStatus('Please fill in all fields correctly.', 'error');
                return;
            }

            try {
                // Submit to Netlify Forms for notification
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                this.showStatus('Review submitted successfully! It will appear after approval.', 'success');
                e.target.reset();
                this.resetStarRating();
                this.closeModal();

                // Show the review data for manual addition
                console.log('New review data:', reviewData);
                
                // Show instructions
                setTimeout(() => {
                    const instructions = `
Review submitted successfully!

To add this review to your website:
1. Copy this data:
${JSON.stringify(reviewData, null, 2)}

2. Add it to your reviews.json file
3. Push to GitHub to deploy

The review has been emailed to you via Netlify Forms.`;
                    
                    alert(instructions);
                }, 1000);

            } catch (error) {
                console.error('Submission error:', error);
                this.showStatus('Error submitting review. Please try again.', 'error');
            }
        });
    }

    validateReview(data) {
        return data.name && 
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

        // Auto-advance every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 5000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing JSON Reviews System');
    window.homeaidReviews = new JSONReviews();
});
