// Simple Reviews System - Works with Netlify Forms
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
            console.log('Setting up review form - Netlify Forms version');
            
            // Handle form submission
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted - Netlify Forms handler');
                
                // Get form data
                const name = document.getElementById('reviewName').value;
                const email = document.getElementById('reviewEmail').value;
                const service = document.getElementById('reviewService').value;
                const rating = document.getElementById('reviewRating').value;
                const message = document.getElementById('reviewMessage').value;
                
                console.log('Form data:', { name, email, service, rating, message });
                
                // Show loading state
                const statusElement = document.getElementById('review-status');
                statusElement.textContent = 'Submitting your review...';
                statusElement.className = 'form-status';
                
                // Add to display immediately
                if (window.addNewReview) {
                    console.log('Adding review to display');
                    window.addNewReview(name, service, message, parseInt(rating));
                }
                
                // Save to localStorage for persistence
                try {
                    const localReviews = JSON.parse(localStorage.getItem('homeaid_reviews') || '[]');
                    localReviews.push({
                        name: name,
                        service: service,
                        message: message,
                        rating: parseInt(rating),
                        date: new Date().toISOString().split('T')[0]
                    });
                    localStorage.setItem('homeaid_reviews', JSON.stringify(localReviews));
                    console.log('Review saved to localStorage');
                } catch (err) {
                    console.error('Error saving to localStorage:', err);
                }
                
                // Submit to Netlify Forms
                const formData = new FormData(reviewForm);
                
                // Add the rating value explicitly
                formData.append('rating', rating);
                
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                })
                .then(response => {
                    console.log('Netlify Forms response:', response);
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response;
                })
                .then(() => {
                    console.log('Form submitted to Netlify Forms successfully');
                    
                    // Show success message
                    statusElement.textContent = 'Thank you for your review! It has been added.';
                    statusElement.className = 'form-status success';
                    
                    // Reset form
                    reviewForm.reset();
                    
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
                });
            });
        }
    }
    
    // Also load reviews from localStorage
    try {
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
    } catch (err) {
        console.error('Error loading from localStorage:', err);
    }
});
