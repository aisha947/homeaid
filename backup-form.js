// BACKUP FORM HANDLER - GUARANTEED TO WORK
console.log('Backup form handler loaded');

function initBackupForm() {
    console.log('Initializing backup form handler');
    
    // Modal functionality
    const openReviewBtn = document.getElementById('openReviewForm');
    const reviewModal = document.getElementById('reviewModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (openReviewBtn && reviewModal) {
        openReviewBtn.addEventListener('click', function() {
            console.log('Opening review modal');
            reviewModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal && reviewModal) {
        closeModal.addEventListener('click', function() {
            console.log('Closing review modal');
            reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Star rating
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('reviewRating');
    
    if (stars.length > 0 && ratingInput) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingInput.value = rating;
                console.log('Rating selected:', rating);
                
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
    
    // Form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        console.log('Adding form submission handler');
        
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');
            
            // Get form data
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const service = document.getElementById('reviewService').value;
            const rating = document.getElementById('reviewRating').value;
            const message = document.getElementById('reviewMessage').value;
            
            console.log('Form data:', { name, email, service, rating, message });
            
            // Validate
            if (!name || !email || !service || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (rating === '0' || !rating) {
                alert('Please select a rating');
                return;
            }
            
            // Show loading
            const statusDiv = document.getElementById('review-status');
            if (statusDiv) {
                statusDiv.textContent = 'Adding your review...';
                statusDiv.className = 'form-status';
            }
            
            // Add review
            if (window.addNewReview) {
                console.log('Adding review to slider...');
                window.addNewReview(name, service, message, parseInt(rating));
                
                // Show success
                if (statusDiv) {
                    statusDiv.textContent = 'Thank you! Your review has been added.';
                    statusDiv.className = 'form-status success';
                }
                
                // Reset form
                reviewForm.reset();
                
                // Reset stars
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                if (ratingInput) ratingInput.value = '0';
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    if (reviewModal) {
                        reviewModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                    if (statusDiv) {
                        statusDiv.className = 'form-status';
                        statusDiv.textContent = '';
                    }
                }, 3000);
                
            } else {
                console.error('addNewReview function not available');
                if (statusDiv) {
                    statusDiv.textContent = 'Error: Review system not available';
                    statusDiv.className = 'form-status error';
                }
            }
        });
    } else {
        console.error('Review form not found');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackupForm);
} else {
    initBackupForm();
}
