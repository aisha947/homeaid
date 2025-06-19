// Load reviews from JSON file - Works on Netlify
console.log('JSON reviews loader script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Load reviews from JSON file
    loadReviewsFromJSON();
    
    // Function to load reviews from JSON file
    function loadReviewsFromJSON() {
        fetch('reviews.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.reviews && data.reviews.length > 0) {
                    console.log(`Loaded ${data.reviews.length} reviews from JSON file`);
                    
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
                    console.log('No reviews found in JSON file');
                }
            })
            .catch(error => {
                console.error('Error loading reviews from JSON:', error);
            });
    }
    
    // Handle review form submission
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
            
            // Save review data for admin
            const reviewData = {
                name: name,
                service: service,
                message: message,
                rating: parseInt(rating),
                date: new Date().toISOString().split('T')[0]
            };
            
            // Store pending reviews in local storage for the admin
            let pendingReviews = JSON.parse(localStorage.getItem('homeaid_pending_reviews') || '[]');
            pendingReviews.push(reviewData);
            localStorage.setItem('homeaid_pending_reviews', JSON.stringify(pendingReviews));
            
            // Show admin instructions after submission
            setTimeout(() => {
                const statusElement = document.getElementById('review-status');
                if (statusElement) {
                    statusElement.innerHTML += `
                        <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                            <p><strong>For site owner:</strong> To make this review visible to all visitors, add it to your reviews.json file with this data:</p>
                            <pre style="background: #f5f5f5; padding: 10px; overflow: auto; font-size: 0.8em;">{
  "name": "${name}",
  "service": "${service}",
  "message": "${message}",
  "rating": ${rating},
  "date": "${new Date().toISOString().split('T')[0]}"
}</pre>
                        </div>
                    `;
                }
            }, 3000);
        }, false);
    }
});
