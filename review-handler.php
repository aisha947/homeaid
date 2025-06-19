<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle different request methods
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Add new review
    addReview();
} elseif ($method === 'GET') {
    // Get all reviews
    getReviews();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function addReview() {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['service']) || 
        !isset($input['rating']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    // Sanitize input
    $review = [
        'id' => uniqid(),
        'name' => htmlspecialchars(trim($input['name'])),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'service' => htmlspecialchars(trim($input['service'])),
        'rating' => intval($input['rating']),
        'message' => htmlspecialchars(trim($input['message'])),
        'date' => date('Y-m-d H:i:s'),
        'approved' => true // Auto-approve for now, you can change this to false for manual approval
    ];
    
    // Validate email
    if (!filter_var($review['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        return;
    }
    
    // Validate rating
    if ($review['rating'] < 1 || $review['rating'] > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        return;
    }
    
    // Load existing reviews
    $reviews = loadReviews();
    
    // Add new review
    $reviews[] = $review;
    
    // Save reviews
    if (saveReviews($reviews)) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Review added successfully', 'review' => $review]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save review']);
    }
}

function getReviews() {
    $reviews = loadReviews();
    
    // Filter only approved reviews for public display
    $approvedReviews = array_filter($reviews, function($review) {
        return isset($review['approved']) && $review['approved'] === true;
    });
    
    // Sort by date (newest first)
    usort($approvedReviews, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
    
    echo json_encode(['reviews' => array_values($approvedReviews)]);
}

function loadReviews() {
    $file = 'reviews.json';
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $reviews = json_decode($content, true);
        return is_array($reviews) ? $reviews : [];
    }
    return [];
}

function saveReviews($reviews) {
    $file = 'reviews.json';
    $json = json_encode($reviews, JSON_PRETTY_PRINT);
    return file_put_contents($file, $json, LOCK_EX) !== false;
}
?>
