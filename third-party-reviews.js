// Third-party Reviews Integration
// Uses external services for review management

class ThirdPartyReviews {
    constructor() {
        this.reviews = this.getStaticReviews();
        this.init();
    }

    init() {
        this.displayReviews();
        this.setupFormHandler();
        this.setupModalHandlers();
        this.setupStarRating();
    }

    // Static reviews that are always displayed
    getStaticReviews() {
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

    displayReviews() {
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) return;

        testimonialTrack.innerHTML = '';

        this.reviews.forEach((review) => {
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
            
            const formData = new FormData(e.target);
            
            try {
                // Submit to Netlify Forms
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                this.showStatus('Thank you for your review! We will review it and add it to our testimonials.', 'success');
                e.target.reset();
                this.resetStarRating();
                this.closeModal();

            } catch (error) {
                this.showStatus('Error submitting review. Please try again.', 'error');
            }
        });
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
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.homeaidReviews = new ThirdPartyReviews();
});
