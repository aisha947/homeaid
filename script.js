// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        mirror: true,
        offset: 50
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                // Scroll to the target element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Book a Home Visit button action
    document.querySelector('.cta-button').addEventListener('click', function() {
        // Add a pulse animation to the button when clicked
        this.classList.add('pulse-animation');
        
        // Remove the animation class after it completes
        setTimeout(() => {
            this.classList.remove('pulse-animation');
        }, 1000);
        
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        
        window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            
            // Animate the icon
            const icon = this.querySelector('.service-icon i');
            icon.style.transform = 'scale(1.15)';
            icon.style.color = 'var(--secondary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
            
            // Reset the icon
            const icon = this.querySelector('.service-icon i');
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--primary-color)';
        });
    });

    // Form submission with AJAX
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Create loading indicator
            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Send form data using fetch API
            fetch('form-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Show success message
                showFormStatus('success', 'Thank you for your message! We will contact you soon.');
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                showFormStatus('error', 'There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }
});

// Form status handling
function showFormStatus(type, message) {
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    
    // Add animation
    formStatus.style.animation = 'fadeIn 0.5s ease-out forwards';
    
    // Hide the message after 5 seconds
    setTimeout(() => {
        formStatus.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, 500);
    }, 5000);
}

// Scroll to top button functionality
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
