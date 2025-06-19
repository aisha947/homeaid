// Fix to ensure ALL reviews are displayed in sequence
console.log('Fix all reviews script loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for other scripts to initialize
    setTimeout(function() {
        console.log('Applying fix for all reviews to display in sequence');
        
        // Get all slides
        const testimonialTrack = document.querySelector('.testimonial-track');
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');
        
        console.log(`Found ${slides.length} total reviews`);
        
        if (!testimonialTrack || !testimonialSlider || slides.length === 0) {
            console.error('Required elements not found');
            return;
        }
        
        // Clear any existing intervals to prevent conflicts
        if (window._reviewInterval) {
            clearInterval(window._reviewInterval);
        }
        
        // Set up variables for navigation
        let currentIndex = 0;
        
        // Function to update slide widths and track width
        function updateSlideWidths() {
            const slideWidth = testimonialSlider.offsetWidth;
            
            // Make sure all slides have the correct width
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
            
            // Set the track width to accommodate all slides
            testimonialTrack.style.width = `${slideWidth * slides.length}px`;
            
            return slideWidth;
        }
        
        // Initial update
        let slideWidth = updateSlideWidths();
        
        // Function to go to a specific slide
        function goToSlide(index) {
            // Ensure index is within bounds
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            
            // Update slide widths in case of window resize
            slideWidth = updateSlideWidths();
            
            // Move the track to show the current slide
            testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Log which review is currently showing
            console.log(`Showing review ${currentIndex + 1} of ${slides.length}`);
            
            // Update counter if it exists
            const counter = document.querySelector('.review-counter');
            if (counter) {
                counter.innerHTML = `Review ${currentIndex + 1} of ${slides.length}`;
            }
        }
        
        // Set up click handlers for navigation buttons
        if (prevBtn) {
            prevBtn.onclick = function(e) {
                e.preventDefault();
                goToSlide(currentIndex - 1);
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.preventDefault();
                goToSlide(currentIndex + 1);
            };
        }
        
        // Start auto-scrolling through ALL reviews
        window._reviewInterval = setInterval(function() {
            goToSlide(currentIndex + 1);
        }, 10000); // 10 seconds
        
        // Pause on hover
        testimonialSlider.addEventListener('mouseenter', function() {
            clearInterval(window._reviewInterval);
        });
        
        // Resume on mouse leave
        testimonialSlider.addEventListener('mouseleave', function() {
            window._reviewInterval = setInterval(function() {
                goToSlide(currentIndex + 1);
            }, 10000); // 10 seconds
        });
        
        // Add a counter to show which review is currently displayed
        const container = document.querySelector('.testimonial-container');
        if (container) {
            // Check if counter already exists
            let counter = document.querySelector('.review-counter');
            
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'review-counter';
                counter.style.textAlign = 'center';
                counter.style.margin = '10px 0';
                counter.style.fontSize = '14px';
                counter.style.color = '#666';
                counter.innerHTML = `Review 1 of ${slides.length}`;
                
                // Insert after the controls
                const controls = document.querySelector('.testimonial-controls');
                if (controls && controls.nextSibling) {
                    container.insertBefore(counter, controls.nextSibling);
                } else {
                    container.appendChild(counter);
                }
            } else {
                counter.innerHTML = `Review 1 of ${slides.length}`;
            }
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Update slide widths and reposition to current slide
            slideWidth = updateSlideWidths();
            testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        });
        
        // Go to first slide to start
        goToSlide(0);
        
        console.log('All reviews fix applied successfully');
    }, 1000); // Wait 1 second for other scripts to initialize
});
