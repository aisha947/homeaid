// Cross-Device Reviews System - Works across all devices
console.log('Cross-device reviews system loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Load reviews from API
    loadReviewsFromAPI();
    
    // Handle review form submission
    setupReviewForm();
    
    // Function to load reviews from API
    function loadReviewsFromAPI() {
        fetch('/api/reviews')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.reviews && data.reviews.length > 0) {
                    console.log(`Loaded ${data.reviews.length} reviews from API`);
                    
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
                } else {
                    console.log('No reviews found in API');
                    
                    // Fall back to JSON file if API returns no reviews
                    loadFallbackReviews();
                }
            })
            .catch(error => {
                console.error('Error loading reviews from API:', error);
                
                // Fall back to JSON file if API fails
                loadFallbackReviews();
            });
    }
    
    // Function to load fallback reviews from JSON
    function loadFallbackReviews() {
        fetch('reviews.json')
            .then(response => response.json())
            .then(data => {
                if (data && data.reviews && data.reviews.length > 0) {
                    console.log(`Loaded ${data.reviews.length} fallback reviews from JSON`);
                    
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
                console.error('Error loading fallback reviews:', error);
            });
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
                    email: email,
                    date: new Date().toISOString().split('T')[0]
                };
                
                // Show loading state
                document.getElementById('review-status').textContent = 'Submitting your review...';
                document.getElementById('review-status').className = 'form-status';
                
                // Submit to API
                fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(review)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Review submitted successfully:', data);
                    
                    // Add to display
                    if (window.addNewReview) {
                        window.addNewReview(name, service, message, parseInt(rating));
                    }
                    
                    // Show success message
                    document.getElementById('review-status').textContent = 'Thank you for your review! It has been added and is visible to everyone.';
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
                    console.error('Error submitting review:', error);
                    
                    // Show error message
                    document.getElementById('review-status').textContent = 'There was an error submitting your review. Please try again later.';
                    document.getElementById('review-status').className = 'form-status error';
                    
                    // Also submit to Netlify forms as backup
                    const formData = new FormData(reviewForm);
                    fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(formData).toString()
                    })
                    .then(() => {
                        console.log('Form submitted to Netlify as backup');
                    })
                    .catch(netlifyError => {
                        console.error('Error submitting to Netlify:', netlifyError);
                    });
                });
            });
        }
    }
});
