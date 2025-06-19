// Automatic Reviews System - No manual intervention required
console.log('Auto reviews system loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase (free tier)
    const firebaseConfig = {
        apiKey: "AIzaSyBxJAJz_-1VCH5WNJZ-YQvPx5d5UVngZpE",
        authDomain: "homeaid-reviews.firebaseapp.com",
        projectId: "homeaid-reviews",
        storageBucket: "homeaid-reviews.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abc123def456ghi789jkl"
    };

    // Load Firebase from CDN
    loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js', function() {
        loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js', function() {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            const db = firebase.firestore();
            const reviewsCollection = db.collection('reviews');
            
            // Load all reviews from Firestore
            loadReviewsFromFirestore();
            
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
                    
                    // Create review object
                    const review = {
                        name: name,
                        service: service,
                        message: message,
                        rating: parseInt(rating),
                        email: email, // Stored but not displayed
                        date: new Date().toISOString(),
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    // Save to Firestore
                    reviewsCollection.add(review)
                        .then(function(docRef) {
                            console.log("Review added with ID: ", docRef.id);
                            
                            // Update status message
                            setTimeout(() => {
                                const statusElement = document.getElementById('review-status');
                                if (statusElement) {
                                    statusElement.innerHTML = 'Thank you for your review! It has been added and is now visible to everyone.';
                                }
                            }, 2000);
                        })
                        .catch(function(error) {
                            console.error("Error adding review: ", error);
                        });
                }, false);
            }
            
            // Function to load reviews from Firestore
            function loadReviewsFromFirestore() {
                reviewsCollection.orderBy('timestamp', 'desc').get()
                    .then((querySnapshot) => {
                        console.log(`Loaded ${querySnapshot.size} reviews from Firestore`);
                        
                        // Add each review to the slider
                        querySnapshot.forEach((doc) => {
                            const review = doc.data();
                            if (window.addNewReview) {
                                window.addNewReview(
                                    review.name,
                                    review.service,
                                    review.message,
                                    review.rating
                                );
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("Error getting reviews: ", error);
                        
                        // Fallback to local JSON if Firestore fails
                        loadFallbackReviews();
                    });
            }
            
            // Fallback to load reviews from local JSON if Firestore fails
            function loadFallbackReviews() {
                console.log('Falling back to local JSON reviews');
                fetch('reviews.json')
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.reviews && data.reviews.length > 0) {
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
                        console.error('Error loading fallback reviews:', error);
                    });
            }
        });
    });
    
    // Helper function to load scripts dynamically
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
});
