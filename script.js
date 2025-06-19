// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        mirror: true,
        offset: 50
    });

    // Load existing reviews on page load
    loadExistingReviews();

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                // Scroll to the target element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Book a Home Visit button action
    document.querySelector('.cta-button').addEventListener('click', function() {
        // Add a pulse animation to the button when clicked
        this.classList.add('pulse-animation');
        
        // Remove the animation class after it completes
        setTimeout(() => {
            this.classList.remove('pulse-animation');
        }, 1000);
        
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        
        window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            
            // Animate the icon
            const icon = this.querySelector('.service-icon i');
            icon.style.transform = 'scale(1.15)';
            icon.style.color = 'var(--secondary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
            
            // Reset the icon
            const icon = this.querySelector('.service-icon i');
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--primary-color)';
        });
    });

    // Form submission with AJAX
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Create loading indicator
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Send form data using fetch API
            fetch('form-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Show success message
                showFormStatus('success', 'Thank you for your message! We will contact you soon.');
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                showFormStatus('error', 'There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }

    // Counter animation
    const counters = document.querySelectorAll('.counter-number');
    
    if (counters.length > 0) {
        // Function to start counting when element is in viewport
        const startCounting = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    let count = 0;
                    const speed = 2000 / target; // Adjust speed based on target value
                    
                    const updateCount = () => {
                        if (count < target) {
                            count++;
                            counter.textContent = count;
                            setTimeout(updateCount, speed);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        };
        
        // Create the Intersection Observer
        const counterObserver = new IntersectionObserver(startCounting, {
            root: null,
            threshold: 0.1
        });
        
        // Observe each counter element
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Testimonial slider - Completely rewritten
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialTrack = document.querySelector('.testimonial-track');
    let slides = document.querySelectorAll('.testimonial-slide');
    let dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentIndex = 0;
    let slideWidth = 0;
    
    // Function to initialize the slider
    function initSlider() {
        if (!testimonialSlider || !testimonialTrack || slides.length === 0) return;
        
        // Set the width of the track based on the number of slides
        slideWidth = testimonialSlider.offsetWidth;
        testimonialTrack.style.width = `${slideWidth * slides.length}px`;
        
        // Set the width of each slide
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        
        // Show the first slide
        goToSlide(0);
    }
    
    // Function to go to a specific slide
    function goToSlide(index) {
        if (!testimonialTrack) return;
        
        // Update current index
        currentIndex = index;
        
        // Move the track to show the current slide
        testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Update dots if they exist
        if (dots && dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    }
    
    // Function to go to the next slide
    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex);
    }
    
    // Function to go to the previous slide
    function prevSlide() {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
    }
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Initialize the slider
    initSlider();
    
    // Update slider on window resize
    window.addEventListener('resize', initSlider);
    
    // Auto-advance slides every 10 seconds
    let slideInterval = setInterval(nextSlide, 10000); // Changed from 3000 to 10000 (10 seconds)
    
    // Pause auto-advance when hovering over the slider
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    // Resume auto-advance when mouse leaves the slider
    testimonialSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 10000); // Changed from 3000 to 10000 (10 seconds)
    });
    
    // Function to add a new review to the testimonial slider
    window.addNewReview = function(name, service, message, rating) {
        if (!testimonialTrack) return;
        
        // Create star rating HTML based on the rating
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        // Create new slide
        const newSlide = document.createElement('div');
        newSlide.className = 'testimonial-slide';
        newSlide.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-text">
                    <p>${message}</p>
                </div>
                <div class="testimonial-author">
                    <div class="author-image">
                        <img src="https://randomuser.me/api/portraits/lego/1.jpg" alt="Patient">
                    </div>
                    <div class="author-info">
                        <h4>${name}</h4>
                        <p>${service} Patient</p>
                    </div>
                    <div class="testimonial-rating">
                        ${starsHTML}
                    </div>
                </div>
            </div>
        `;
        
        // Add the new slide to the track
        testimonialTrack.appendChild(newSlide);
        
        // Update the slides array to include the new slide
        slides = document.querySelectorAll('.testimonial-slide');
        
        // Add a new dot if dots container exists
        const dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            const newDot = document.createElement('span');
            newDot.className = 'dot';
            newDot.setAttribute('data-slide', slides.length - 1);
            dotsContainer.appendChild(newDot);
            
            // Add event listener to the new dot
            newDot.addEventListener('click', () => {
                goToSlide(slides.length - 1);
            });
            
            // Update dots array
            dots = document.querySelectorAll('.dot');
        }
        
        // Update the slider to include the new review
        initSlider();
        
        // Don't jump to the new slide immediately - let it appear in natural sequence
        // The auto-advance will eventually show it
    };

    // Review modal functionality
    const openReviewBtn = document.getElementById('openReviewForm');
    const reviewModal = document.getElementById('reviewModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (openReviewBtn && reviewModal) {
        openReviewBtn.addEventListener('click', () => {
            reviewModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        closeModal.addEventListener('click', () => {
            reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        });
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Star rating functionality
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('reviewRating');
    
    if (stars.length > 0 && ratingInput) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingInput.value = rating;
                
                // Update star appearance
                stars.forEach(s => {
                    const sRating = s.getAttribute('data-rating');
                    if (sRating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
    }

    // Review form submission
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const service = document.getElementById('reviewService').value;
            const rating = document.getElementById('reviewRating').value;
            const message = document.getElementById('reviewMessage').value;
            
            // Validate rating
            if (rating === '0') {
                document.getElementById('review-status').textContent = 'Please select a rating';
                document.getElementById('review-status').className = 'form-status error';
                return;
            }
            
            // Show loading state
            document.getElementById('review-status').textContent = 'Submitting your review...';
            document.getElementById('review-status').className = 'form-status';
            
            try {
                // Try to submit to PHP backend first
                let backendSuccess = false;
                
                try {
                    const response = await fetch('review-handler.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            service: service,
                            rating: parseInt(rating),
                            message: message
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            backendSuccess = true;
                        }
                    }
                } catch (backendError) {
                    console.log('Backend not available, using local storage:', backendError.message);
                    // Backend not available, continue with local storage
                }
                
                // Add the new review to the testimonial slider (works locally)
                window.addNewReview(name, service, message, rating);
                
                // Show success message
                if (backendSuccess) {
                    document.getElementById('review-status').textContent = 'Thank you for your review! It has been saved and added to the display.';
                } else {
                    document.getElementById('review-status').textContent = 'Thank you for your review! It has been added to the display.';
                }
                document.getElementById('review-status').className = 'form-status success';
                
                // Reset form
                reviewForm.reset();
                
                // Reset stars
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    reviewModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.getElementById('review-status').className = 'form-status';
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting review:', error);
                
                // Even if there's an error, still add the review locally
                window.addNewReview(name, service, message, rating);
                
                document.getElementById('review-status').textContent = 'Your review has been added to the display (local mode).';
                document.getElementById('review-status').className = 'form-status success';
                
                // Reset form
                reviewForm.reset();
                
                // Reset stars
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    reviewModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.getElementById('review-status').className = 'form-status';
                }, 3000);
            }
        });
    }
});

// Function to load existing reviews from the server
async function loadExistingReviews() {
    try {
        const response = await fetch('review-handler.php');
        if (response.ok) {
            const data = await response.json();
            if (data.reviews && data.reviews.length > 0) {
                // Clear existing testimonials (except the default ones if you want to keep them)
                const testimonialTrack = document.querySelector('.testimonial-track');
                if (testimonialTrack) {
                    // You can choose to keep existing testimonials or replace them
                    // For now, let's add new reviews to existing ones
                    data.reviews.forEach(review => {
                        addNewReview(review.name, review.service, review.message, review.rating);
                    });
                }
            }
        }
    } catch (error) {
        console.log('Backend not available for loading reviews, using default reviews:', error.message);
        // Backend not available, just use the default reviews in HTML
    }
}

// Form status handling
function showFormStatus(type, message) {
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    
    // Add animation
    formStatus.style.animation = 'fadeIn 0.5s ease-out forwards';
    
    // Hide the message after 5 seconds
    setTimeout(() => {
        formStatus.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, 500);
    }, 5000);
}

// Scroll to top button functionality
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
