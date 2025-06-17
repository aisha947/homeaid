# HomeAid Services Landing Page

A modern, responsive landing page for HomeAid Services, a home healthcare provider led by Rehan Khalid.

## Features

- Responsive design that works on all devices
- Modern animations and transitions
- Contact form with PHP backend
- Professional service showcase
- Clean and medical-focused design

## Setup Instructions

### Local Development

1. Clone or download this repository to your local machine
2. To view the page with PHP functionality (for the contact form):
   ```
   cd /path/to/homeaid
   php -S localhost:8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Production Deployment

1. Upload all files to your web hosting server
2. Ensure PHP is enabled on your server
3. The contact form will send emails to: `homeaidhomecareservices@gmail.com`

## Form Functionality

The contact form sends submissions to `homeaidhomecareservices@gmail.com`. For this to work properly:

1. Your server must have PHP installed and configured
2. The mail() function must be properly configured on your server
3. If using a local development environment, emails may not be sent unless you have a mail server configured
4. Form submissions are also logged in `contact_submissions.log` file for backup

## Email Configuration

- All form submissions are sent to: `homeaidhomecareservices@gmail.com`
- The email appears to come from: `noreply@homeaidservices.com` (this can be changed in form-handler.php)
- Reply-to is set to the visitor's email address
- Subject line format: "New Contact Request from HomeAid Website: [Name]"

## Technologies Used

- HTML5
- CSS3
- JavaScript
- PHP (for form handling)
- Font Awesome (for icons)
- AOS - Animate On Scroll library

## Customization

- Colors can be modified in the CSS variables at the top of `styles.css`
- Services can be edited in the HTML file
- Contact information can be updated in the HTML file
- About section image can be replaced with Rehan Khalid's photo

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)
