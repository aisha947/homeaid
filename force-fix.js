// FORCE FIX FOR TESTIMONIAL TEXT WRAPPING
document.addEventListener('DOMContentLoaded', function() {
    console.log('Force fix script loaded');
    
    function fixTestimonialText() {
        const testimonialTexts = document.querySelectorAll('.testimonial-text p');
        console.log('Found testimonial texts:', testimonialTexts.length);
        
        testimonialTexts.forEach((p, index) => {
            console.log(`Fixing testimonial ${index + 1}`);
            
            // Force normal text styles
            p.style.display = 'block';
            p.style.wordWrap = 'break-word';
            p.style.overflowWrap = 'break-word';
            p.style.whiteSpace = 'normal';
            p.style.width = '100%';
            p.style.maxWidth = '100%';
            p.style.webkitBoxOrient = 'initial';
            p.style.webkitLineClamp = 'initial';
            p.style.textOverflow = 'initial';
            p.style.webkitBox = 'initial';
            p.style.flex = 'initial';
            
            // Log the text content
            console.log(`Text ${index + 1}:`, p.textContent.substring(0, 50) + '...');
            console.log(`Text ${index + 1} computed styles:`, {
                display: getComputedStyle(p).display,
                whiteSpace: getComputedStyle(p).whiteSpace,
                wordWrap: getComputedStyle(p).wordWrap,
                width: getComputedStyle(p).width
            });
        });
    }
    
    // Fix immediately
    fixTestimonialText();
    
    // Fix again after a short delay (in case of dynamic content)
    setTimeout(fixTestimonialText, 1000);
    
    // Fix whenever new reviews are added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                console.log('DOM changed, re-fixing testimonials');
                setTimeout(fixTestimonialText, 100);
            }
        });
    });
    
    const testimonialContainer = document.querySelector('.testimonial-track');
    if (testimonialContainer) {
        observer.observe(testimonialContainer, { childList: true, subtree: true });
    }
});
