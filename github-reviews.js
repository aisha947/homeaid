// GitHub-based Reviews System
// Reviews are stored in reviews.json and updated via GitHub API

class GitHubReviews {
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

    // Load reviews from reviews.json file
    async loadReviews() {
        try {
            const response = await fetch('./reviews.json');
            if (response.ok) {
                const data = await response.json();
                this.reviews = data.reviews || [];
            } else {
                // If file doesn't exist, create default reviews
                this.reviews = this.getDefaultReviews();
            }
        } catch (error) {
            console.log('Loading default reviews');
            this.reviews = this.getDefaultReviews();
        }
    }

    getDefaultReviews() {
        return [
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

    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        testimonialTrack.innerHTML = '';

        // Sort reviews by date (newest first)
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

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e);
        });
    }

    async handleFormSubmission(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const reviewData = {
            name: formData.get('reviewName').trim(),
            service: formData.get('reviewService'),
            rating: parseInt(formData.get('reviewRating')),
            message: formData.get('reviewMessage').trim(),
            date: new Date().toISOString().split('T')[0]
        };

        if (!this.validateReviewData(reviewData)) {
            this.showStatus('Please fill in all required fields correctly.', 'error');
            return;
        }

        try {
            // Submit to Netlify Forms
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            // Add review to display immediately
            this.reviews.unshift(reviewData);
            this.displayReviews();

            this.showStatus('Thank you for your review! It has been added successfully.', 'success');
            form.reset();
            this.resetStarRating();
            this.closeModal();

            // Show instructions for making it permanent
            setTimeout(() => {
                alert(`Your review has been added! 

To make it permanent on your website:
1. Copy this review data:
${JSON.stringify(reviewData, null, 2)}

2. Add it to your reviews.json file in GitHub
3. Push the changes to deploy

Your review is visible now but will be permanent after you update the JSON file.`);
            }, 2000);

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showStatus('There was an error. Please try again.', 'error');
        }
    }

    validateReviewData(data) {
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
            openBtn.addEventListener('click', () => modal.style.display = 'block');
        }

        if (closeBtn && modal) {
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

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!window.homeaidReviews) {
        window.homeaidReviews = new GitHubReviews();
    }
});
