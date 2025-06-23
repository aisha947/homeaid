from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

REVIEWS_FILE = 'reviews.json'
ADMIN_PASSWORD = 'homeaid2024'  # Change this to a secure password

def load_reviews():
    if os.path.exists(REVIEWS_FILE):
        try:
            with open(REVIEWS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_reviews(reviews):
    try:
        with open(REVIEWS_FILE, 'w') as f:
            json.dump(reviews, f, indent=2)
        return True
    except:
        return False

def send_admin_notification(review):
    try:
        # Configure your email settings here
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "homeaidhomecareservices@gmail.com"
        sender_password = "your_app_password"  # Use app password for Gmail
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = sender_email
        msg['Subject'] = "New Review Pending Approval - HomeAid Services"
        
        body = f"""
        A new review has been submitted and is pending approval:
        
        Name: {review['name']}
        Email: {review['email']}
        Service: {review['service']}
        Rating: {review['rating']}/5
        Message: {review['message']}
        Date: {review['date']}
        
        To approve this review, visit your admin panel at:
        http://your-domain.com/admin
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, sender_email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Email notification failed: {e}")
        return False

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = load_reviews()
    
    # Only return approved reviews for public API
    if request.args.get('admin') != 'true':
        reviews = [r for r in reviews if r.get('approved', False)]
    
    # Sort by date (newest first)
    reviews.sort(key=lambda x: x['date'], reverse=True)
    
    return jsonify({'reviews': reviews})

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'service', 'rating', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate email
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, data['email']):
        return jsonify({'error': 'Invalid email address'}), 400
    
    # Validate rating
    try:
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    except:
        return jsonify({'error': 'Invalid rating'}), 400
    
    # Create review object
    review = {
        'id': str(uuid.uuid4()),
        'name': data['name'].strip(),
        'email': data['email'].strip().lower(),
        'service': data['service'].strip(),
        'rating': rating,
        'message': data['message'].strip(),
        'date': datetime.now().isoformat(),
        'approved': False,  # Require manual approval
        'ip_address': request.remote_addr
    }
    
    # Load existing reviews and add new one
    reviews = load_reviews()
    reviews.append(review)
    
    # Save reviews
    if save_reviews(reviews):
        # Send notification to admin
        send_admin_notification(review)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your review! It will be published after moderation.',
            'pending': True
        }), 201
    else:
        return jsonify({'error': 'Failed to save review'}), 500

@app.route('/api/reviews/<review_id>/approve', methods=['PUT'])
def approve_review(review_id):
    # Simple authentication check
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f'Bearer {ADMIN_PASSWORD}':
        return jsonify({'error': 'Unauthorized'}), 401
    
    reviews = load_reviews()
    
    # Find and approve the review
    for review in reviews:
        if review['id'] == review_id:
            review['approved'] = True
            if save_reviews(reviews):
                return jsonify({'success': True, 'message': 'Review approved'})
            else:
                return jsonify({'error': 'Failed to save changes'}), 500
    
    return jsonify({'error': 'Review not found'}), 404

@app.route('/api/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    # Simple authentication check
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f'Bearer {ADMIN_PASSWORD}':
        return jsonify({'error': 'Unauthorized'}), 401
    
    reviews = load_reviews()
    reviews = [r for r in reviews if r['id'] != review_id]
    
    if save_reviews(reviews):
        return jsonify({'success': True, 'message': 'Review deleted'})
    else:
        return jsonify({'error': 'Failed to save changes'}), 500

@app.route('/admin')
def admin_panel():
    admin_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>HomeAid Reviews Admin</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .review { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
            .pending { background-color: #fff3cd; }
            .approved { background-color: #d4edda; }
            button { margin: 5px; padding: 8px 15px; cursor: pointer; }
            .approve { background-color: #28a745; color: white; border: none; }
            .delete { background-color: #dc3545; color: white; border: none; }
            .login { max-width: 300px; margin: 50px auto; }
            input { width: 100%; padding: 10px; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div id="loginForm" class="login">
            <h2>Admin Login</h2>
            <input type="password" id="password" placeholder="Admin Password">
            <button onclick="login()">Login</button>
        </div>
        
        <div id="adminPanel" style="display: none;">
            <h1>HomeAid Reviews Admin Panel</h1>
            <button onclick="loadReviews()">Refresh Reviews</button>
            <div id="reviews"></div>
        </div>

        <script>
            let authToken = '';
            
            function login() {
                const password = document.getElementById('password').value;
                authToken = password;
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadReviews();
            }
            
            async function loadReviews() {
                try {
                    const response = await fetch('/api/reviews?admin=true');
                    const data = await response.json();
                    displayReviews(data.reviews);
                } catch (error) {
                    alert('Error loading reviews: ' + error.message);
                }
            }
            
            function displayReviews(reviews) {
                const container = document.getElementById('reviews');
                container.innerHTML = '';
                
                reviews.forEach(review => {
                    const div = document.createElement('div');
                    div.className = `review ${review.approved ? 'approved' : 'pending'}`;
                    div.innerHTML = `
                        <h3>${review.name} - ${review.rating}/5 stars</h3>
                        <p><strong>Service:</strong> ${review.service}</p>
                        <p><strong>Email:</strong> ${review.email}</p>
                        <p><strong>Date:</strong> ${new Date(review.date).toLocaleString()}</p>
                        <p><strong>Message:</strong> ${review.message}</p>
                        <p><strong>Status:</strong> ${review.approved ? 'Approved' : 'Pending'}</p>
                        ${!review.approved ? `<button class="approve" onclick="approveReview('${review.id}')">Approve</button>` : ''}
                        <button class="delete" onclick="deleteReview('${review.id}')">Delete</button>
                    `;
                    container.appendChild(div);
                });
            }
            
            async function approveReview(id) {
                try {
                    const response = await fetch(`/api/reviews/${id}/approve`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    
                    if (response.ok) {
                        loadReviews();
                    } else {
                        alert('Failed to approve review');
                    }
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            }
            
            async function deleteReview(id) {
                if (confirm('Are you sure you want to delete this review?')) {
                    try {
                        const response = await fetch(`/api/reviews/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${authToken}`
                            }
                        });
                        
                        if (response.ok) {
                            loadReviews();
                        } else {
                            alert('Failed to delete review');
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }
            }
        </script>
    </body>
    </html>
    """
    return render_template_string(admin_html)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
