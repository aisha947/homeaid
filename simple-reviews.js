// Simple Reviews System - Works across devices with Netlify Forms
console.log('Simple reviews system loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Load initial reviews from JSON
    loadInitialReviews();
    
    // Set up the review form
    setupReviewForm();
    
    // Function to load initial reviews from JSON
    function loadInitialReviews() {
        fetch('reviews.json')
            .then(response => response.json())
            .then(data => {
                if (data && data.reviews && data.reviews.length > 0) {
                    console.log(`Loaded ${data.reviews.length} reviews from JSON`);
                    
                    // Add each review to the slider
                    data.reviews.forEach(review => {
                        if (window.addNewReview) {
                            window.addNewReview(
                                review.name,
                                review.service,
                                review.message,
                                review.rating
                            );
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading reviews:', error);
            });
    }
    
    // Function to set up the review form
    function setupReviewForm() {
        const reviewForm = document.getElementById('reviewForm');
        
        if (reviewForm) {
            // Remove any existing event listeners
            const newForm = reviewForm.cloneNode(true);
            reviewForm.parentNode.replaceChild(newForm, reviewForm);
            
            // Configure for Netlify Forms
            newForm.setAttribute('data-netlify', 'true');
            newForm.setAttribute('name', 'reviews');
            
            // Add hidden input for Netlify Forms
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'form-name';
            hiddenInput.value = 'reviews';
            newForm.prepend(hiddenInput);
            
            // Handle form submission
            newForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('reviewName').value;
                const email = document.getElementById('reviewEmail').value;
                const service = document.getElementById('reviewService').value;
                const rating = document.getElementById('reviewRating').value;
                const message = document.getElementById('reviewMessage').value;
                
                // Show loading state
                const statusElement = document.getElementById('review-status');
                statusElement.textContent = 'Submitting your review...';
                statusElement.className = 'form-status';
                
                // Add to display immediately
                if (window.addNewReview) {
                    window.addNewReview(name, service, message, parseInt(rating));
                }
                
                // Submit to Netlify Forms
                const formData = new FormData(newForm);
                
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                })
                .then(() => {
                    console.log('Form submitted to Netlify Forms');
                    
                    // Show success message
                    statusElement.textContent = 'Thank you for your review! It has been added.';
                    statusElement.className = 'form-status success';
                    
                    // Reset form
                    newForm.reset();
                    
                    // Reset stars
                    const stars = document.querySelectorAll('.star-rating i');
                    stars.forEach(s => {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    });
                    document.getElementById('reviewRating').value = '0';
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        const reviewModal = document.getElementById('reviewModal');
                        if (reviewModal) {
                            reviewModal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                        statusElement.className = 'form-status';
                        statusElement.textContent = '';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error submitting to Netlify Forms:', error);
                    
                    // Still show success since we added the review to the display
                    statusElement.textContent = 'Your review has been added to the display.';
                    statusElement.className = 'form-status success';
                });
            });
        }
    }
});
