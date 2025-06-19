// Debug script to fix review display issues
console.log('Debug reviews script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug reviews DOM loaded');
    
    // Check if testimonial elements exist
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    console.log('Testimonial track found:', !!testimonialTrack);
    console.log('Testimonial slider found:', !!testimonialSlider);
    console.log('Prev button found:', !!prevBtn);
    console.log('Next button found:', !!nextBtn);
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    
    // Override the addNewReview function to ensure it works
    window.addNewReviewDebug = function(name, service, message, rating) {
        console.log('Debug addNewReview called with:', { name, service, message, rating });
        
        if (!testimonialTrack) {
            console.error('Testimonial track not found!');
            return;
        }
        
        // Create star rating HTML
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
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
        
        console.log('Adding new slide to track');
        testimonialTrack.appendChild(newSlide);
        
        // Update slides array
        const slides = document.querySelectorAll('.testimonial-slide');
        console.log('Total slides after adding:', slides.length);
        
        // Add new dot
        const dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            const newDot = document.createElement('span');
            newDot.className = 'dot';
            newDot.setAttribute('data-slide', slides.length - 1);
            dotsContainer.appendChild(newDot);
            console.log('Added new dot');
            
            // Add click event to dot
            newDot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-slide'));
                goToSlide(index);
            });
        }
        
        // Simple slider functionality
        function goToSlide(index) {
            if (!testimonialTrack) return;
            
            const slideWidth = testimonialSlider.offsetWidth;
            testimonialTrack.style.transform = `translateX(-${index * slideWidth}px)`;
            
            // Update active dot
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Update track width
        if (testimonialSlider) {
            const slideWidth = testimonialSlider.offsetWidth;
            testimonialTrack.style.width = `${slideWidth * slides.length}px`;
            
            // Set width of each slide
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
            
            console.log('Updated track width and slide widths');
        }
        
        // Add click events to navigation buttons if not already added
        if (prevBtn && !prevBtn._hasClickEvent) {
            prevBtn.addEventListener('click', function() {
                const currentTransform = testimonialTrack.style.transform;
                const currentIndex = currentTransform ? 
                    parseInt(currentTransform.match(/-(\d+)px/)[1]) / testimonialSlider.offsetWidth : 0;
                
                const newIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            });
            prevBtn._hasClickEvent = true;
            console.log('Added prev button click event');
        }
        
        if (nextBtn && !nextBtn._hasClickEvent) {
            nextBtn.addEventListener('click', function() {
                const currentTransform = testimonialTrack.style.transform;
                const currentIndex = currentTransform ? 
                    parseInt(currentTransform.match(/-(\d+)px/)[1]) / testimonialSlider.offsetWidth : 0;
                
                const newIndex = (currentIndex + 1) % slides.length;
                goToSlide(newIndex);
            });
            nextBtn._hasClickEvent = true;
            console.log('Added next button click event');
        }
        
        console.log('Review added successfully!');
    };
    
    // Override the form submission to use our debug function
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            console.log('Form submitted (debug listener)');
            
            // Get form data
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const service = document.getElementById('reviewService').value;
            const rating = document.getElementById('reviewRating').value;
            const message = document.getElementById('reviewMessage').value;
            
            console.log('Form data:', { name, email, service, rating, message });
            
            // Call both the original and debug functions
            if (window.addNewReview) {
                console.log('Calling original addNewReview');
                window.addNewReview(name, service, message, parseInt(rating));
            }
            
            console.log('Calling debug addNewReview');
            window.addNewReviewDebug(name, service, message, parseInt(rating));
        }, true); // Use capturing to ensure this runs first
    }
    
    // Add a test review button - REMOVED
    /*
    const container = document.querySelector('.container');
    if (container) {
        const testButton = document.createElement('button');
        testButton.textContent = 'Add Test Review';
        testButton.style.background = '#ff5722';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.padding = '10px 20px';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        testButton.style.margin = '20px 0';
        
        testButton.addEventListener('click', function() {
            window.addNewReviewDebug(
                'Test User', 
                'Test Service', 
                'This is a test review added by the debug script.', 
                5
            );
        });
        
        container.appendChild(testButton);
    }
    */
});
