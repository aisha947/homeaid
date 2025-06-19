// Netlify Reviews System - Works on Netlify deployment
console.log('Netlify reviews system loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Load initial reviews from JSON
    loadInitialReviews();
    
    // Handle review form submission
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
            
        // Also load reviews from localStorage (for newly added reviews)
        const localReviews = JSON.parse(localStorage.getItem('homeaid_reviews') || '[]');
        if (localReviews.length > 0) {
            console.log(`Loaded ${localReviews.length} reviews from localStorage`);
            
            localReviews.forEach(review => {
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
    }
    
    // Function to set up the review form
    function setupReviewForm() {
        const reviewForm = document.getElementById('reviewForm');
        
        if (reviewForm) {
            // Add Netlify form attributes
            reviewForm.setAttribute('data-netlify', 'true');
            reviewForm.setAttribute('name', 'reviews');
            
            // Add hidden input for Netlify
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'form-name';
            hiddenInput.value = 'reviews';
            reviewForm.prepend(hiddenInput);
            
            // Handle form submission
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('reviewName').value;
                const email = document.getElementById('reviewEmail').value;
                const service = document.getElementById('reviewService').value;
                const rating = document.getElementById('reviewRating').value;
                const message = document.getElementById('reviewMessage').value;
                
                // Create review object
                const review = {
                    name: name,
                    service: service,
                    message: message,
                    rating: parseInt(rating),
                    date: new Date().toISOString().split('T')[0]
                };
                
                // Save to localStorage
                const localReviews = JSON.parse(localStorage.getItem('homeaid_reviews') || '[]');
                localReviews.push(review);
                localStorage.setItem('homeaid_reviews', JSON.stringify(localReviews));
                
                // Add to display
                if (window.addNewReview) {
                    window.addNewReview(name, service, message, parseInt(rating));
                }
                
                // Submit to Netlify forms
                const formData = new FormData(reviewForm);
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                })
                .then(() => {
                    console.log('Form successfully submitted to Netlify');
                    
                    // Show success message
                    document.getElementById('review-status').textContent = 'Thank you for your review! It has been added.';
                    document.getElementById('review-status').className = 'form-status success';
                    
                    // Reset form
                    reviewForm.reset();
                    
                    // Reset stars
                    const stars = document.querySelectorAll('.star-rating i');
                    stars.forEach(s => {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    });
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        const reviewModal = document.getElementById('reviewModal');
                        if (reviewModal) {
                            reviewModal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                        document.getElementById('review-status').className = 'form-status';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    
                    // Still show success since we saved to localStorage
                    document.getElementById('review-status').textContent = 'Thank you for your review! It has been added.';
                    document.getElementById('review-status').className = 'form-status success';
                });
            });
        }
    }
});
