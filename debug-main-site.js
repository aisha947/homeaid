// DEBUG SCRIPT FOR MAIN SITE
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== MAIN SITE DEBUG ===');
    
    // Check if all required elements exist
    const elements = {
        reviewForm: document.getElementById('reviewForm'),
        openReviewBtn: document.getElementById('openReviewForm'),
        reviewModal: document.getElementById('reviewModal'),
        reviewName: document.getElementById('reviewName'),
        reviewEmail: document.getElementById('reviewEmail'),
        reviewService: document.getElementById('reviewService'),
        reviewRating: document.getElementById('reviewRating'),
        reviewMessage: document.getElementById('reviewMessage'),
        reviewStatus: document.getElementById('review-status')
    };
    
    console.log('Elements check:', elements);
    
    // Check if main script functions are available
    console.log('addNewReview function available:', typeof window.addNewReview);
    
    // Add a simple form submission handler for testing
    if (elements.reviewForm) {
        console.log('Adding test form handler');
        elements.reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('=== FORM SUBMISSION TEST ===');
            
            const formData = {
                name: elements.reviewName?.value,
                email: elements.reviewEmail?.value,
                service: elements.reviewService?.value,
                rating: elements.reviewRating?.value,
                message: elements.reviewMessage?.value
            };
            
            console.log('Form data:', formData);
            
            // Test adding review directly
            if (window.addNewReview && formData.name && formData.message) {
                console.log('Adding review directly...');
                window.addNewReview(formData.name, formData.service || 'Test Service', formData.message, formData.rating || 5);
                
                // Show success message
                if (elements.reviewStatus) {
                    elements.reviewStatus.textContent = 'Review added successfully (debug mode)!';
                    elements.reviewStatus.className = 'form-status success';
                }
                
                // Reset form
                elements.reviewForm.reset();
                
                // Close modal
                if (elements.reviewModal) {
                    setTimeout(() => {
                        elements.reviewModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }, 2000);
                }
            } else {
                console.error('Cannot add review - missing function or data');
            }
        });
    }
    
    // Test modal opening
    if (elements.openReviewBtn && elements.reviewModal) {
        elements.openReviewBtn.addEventListener('click', function() {
            console.log('Opening review modal...');
            elements.reviewModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Test modal closing
    const closeModal = document.querySelector('.close-modal');
    if (closeModal && elements.reviewModal) {
        closeModal.addEventListener('click', function() {
            console.log('Closing review modal...');
            elements.reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});
