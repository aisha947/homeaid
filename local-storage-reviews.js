// Local Storage Reviews - Works on static hosting like Netlify
console.log('Local storage reviews script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Load reviews from local storage when page loads
    loadReviewsFromLocalStorage();
    
    // Override the form submission to save to local storage
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            // Don't prevent default - let the original handler run too
            
            // Get form data
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const service = document.getElementById('reviewService').value;
            const rating = document.getElementById('reviewRating').value;
            const message = document.getElementById('reviewMessage').value;
            
            // Save to local storage
            saveReviewToLocalStorage({
                name: name,
                email: email,
                service: service,
                rating: parseInt(rating),
                message: message,
                date: new Date().toISOString()
            });
            
            console.log('Review saved to local storage');
        }, false); // Use bubbling phase
    }
    
    // Function to save review to local storage
    function saveReviewToLocalStorage(review) {
        // Get existing reviews
        let reviews = JSON.parse(localStorage.getItem('homeaid_reviews') || '[]');
        
        // Add new review
        reviews.push(review);
        
        // Save back to local storage
        localStorage.setItem('homeaid_reviews', JSON.stringify(reviews));
    }
    
    // Function to load reviews from local storage
    function loadReviewsFromLocalStorage() {
        // Get reviews from local storage
        const reviews = JSON.parse(localStorage.getItem('homeaid_reviews') || '[]');
        
        if (reviews.length === 0) {
            console.log('No reviews found in local storage');
            return;
        }
        
        console.log(`Found ${reviews.length} reviews in local storage`);
        
        // Get testimonial track
        const testimonialTrack = document.querySelector('.testimonial-track');
        if (!testimonialTrack) {
            console.error('Testimonial track not found');
            return;
        }
        
        // Add each review to the slider
        reviews.forEach(review => {
            // Only add if we have the required fields
            if (review.name && review.service && review.message) {
                console.log(`Adding review from ${review.name}`);
                
                // Use the existing addNewReview function if available
                if (window.addNewReview) {
                    window.addNewReview(
                        review.name,
                        review.service,
                        review.message,
                        review.rating || 5
                    );
                }
            }
        });
    }
    
    // Override the original addNewReview function to ensure it updates the slides array
    const originalAddNewReview = window.addNewReview;
    if (originalAddNewReview) {
        window.addNewReview = function(name, service, message, rating) {
            // Call the original function
            originalAddNewReview(name, service, message, rating);
            
            // Make sure the slides array is updated
            const slides = document.querySelectorAll('.testimonial-slide');
            
            // Update the slider to include all slides
            const testimonialSlider = document.querySelector('.testimonial-slider');
            const testimonialTrack = document.querySelector('.testimonial-track');
            
            if (testimonialSlider && testimonialTrack) {
                const slideWidth = testimonialSlider.offsetWidth;
                testimonialTrack.style.width = `${slideWidth * slides.length}px`;
                
                // Set width of each slide
                slides.forEach(slide => {
                    slide.style.width = `${slideWidth}px`;
                });
            }
            
            // Make sure navigation works with all slides
            setupNavigation();
        };
    }
    
    // Function to set up navigation
    function setupNavigation() {
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const testimonialTrack = document.querySelector('.testimonial-track');
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');
        
        if (!testimonialSlider || !testimonialTrack || slides.length === 0) return;
        
        let currentIndex = 0;
        
        // Function to go to a specific slide
        function goToSlide(index) {
            currentIndex = index;
            const slideWidth = testimonialSlider.offsetWidth;
            testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
        
        // Add click events to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            });
        }
        
        // Auto-advance slides every 10 seconds
        let slideInterval = setInterval(function() {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        }, 10000); // Changed from 3000 to 10000 (10 seconds)
        
        // Pause auto-advance when hovering over the slider
        testimonialSlider.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        // Resume auto-advance when mouse leaves the slider
        testimonialSlider.addEventListener('mouseleave', function() {
            slideInterval = setInterval(function() {
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            }, 10000); // Changed from 3000 to 10000 (10 seconds)
        });
    }
    
    // Set up navigation initially
    setupNavigation();
});
