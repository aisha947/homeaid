// Simple JSON Reviews - 100% Free, No External Services
// Reviews collected via Netlify Forms, displayed from JSON file

class SimpleJSONReviews {
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
            const response = await fetch('./reviews.json?v=' + Date.now());
            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
            }
        } catch (error) {
            console.log('Using default reviews');
        }

        // Ensure we have some reviews to display
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
                },
                {
                    name: 'Fatima Khan',
                    service: 'IV Line',
                    message: 'Professional staff and excellent care. Highly recommended!',
                    rating: 5,
                    date: '2024-06-05'
                },
                {
                    name: 'Ahmed Hassan',
                    service: 'Nursing Care',
                    message: 'Very professional team. They took great care of my elderly mother.',
                    rating: 5,
                    date: '2024-06-01'
                }
            ];
        }
    }

    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        testimonialTrack.innerHTML = '';
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedReviews.forEach((review) => {
            this.addReviewToDOM(review);
        });

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
            date: new Date().toISOString().split('T')[0]
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
            // Submit to Netlify Forms
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            this.showStatus('Thank you for your review! We will review it and add it to our testimonials soon.', 'success');
            form.reset();
            this.resetStarRating();
            this.closeModal();

            // Show the review data for easy copying
            console.log('New review data for JSON file:');
            console.log(JSON.stringify(reviewData, null, 2));

            // Show instructions to user
            setTimeout(() => {
                alert(`Thank you for your review!

Your review has been submitted and we've been notified. 
It will appear on the website after we review it.

Review details:
Name: ${reviewData.name}
Service: ${reviewData.service}
Rating: ${reviewData.rating}/5 stars`);
            }, 1000);

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showStatus('Error submitting review. Please try again.', 'error');
        } finally {
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
            openBtn.addEventListener('click', () => modal.style.display = 'block');
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
        if (modal) modal.style.display = 'none';
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

        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 6000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.homeaidReviews = new SimpleJSONReviews();
});
