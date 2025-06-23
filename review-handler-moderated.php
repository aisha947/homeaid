<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    addReview();
} elseif ($method === 'GET') {
    if (isset($_GET['admin']) && $_GET['admin'] === 'true') {
        getAllReviews(); // For admin panel
    } else {
        getApprovedReviews(); // For public display
    }
} elseif ($method === 'PUT') {
    approveReview();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

function addReview() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name']) || !isset($input['email']) || 
        !isset($input['service']) || !isset($input['rating']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $review = [
        'id' => uniqid(),
        'name' => htmlspecialchars(trim($input['name'])),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'service' => htmlspecialchars(trim($input['service'])),
        'rating' => intval($input['rating']),
        'message' => htmlspecialchars(trim($input['message'])),
        'date' => date('Y-m-d H:i:s'),
        'approved' => false, // Require manual approval
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    if (!filter_var($review['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        return;
    }
    
    if ($review['rating'] < 1 || $review['rating'] > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        return;
    }
    
    $reviews = loadReviews();
    $reviews[] = $review;
    
    if (saveReviews($reviews)) {
        // Send notification email to admin
        sendAdminNotification($review);
        
        http_response_code(201);
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your review! It will be published after moderation.',
            'pending' => true
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save review']);
    }
}

function getApprovedReviews() {
    $reviews = loadReviews();
    $approvedReviews = array_filter($reviews, function($review) {
        return isset($review['approved']) && $review['approved'] === true;
    });
    
    usort($approvedReviews, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
    
    echo json_encode(['reviews' => array_values($approvedReviews)]);
}

function getAllReviews() {
    $reviews = loadReviews();
    usort($reviews, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
    
    echo json_encode(['reviews' => $reviews]);
}

function approveReview() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Review ID required']);
        return;
    }
    
    $reviews = loadReviews();
    $found = false;
    
    foreach ($reviews as &$review) {
        if ($review['id'] === $input['id']) {
            $review['approved'] = true;
            $found = true;
            break;
        }
    }
    
    if ($found && saveReviews($reviews)) {
        echo json_encode(['success' => true, 'message' => 'Review approved']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Review not found or failed to save']);
    }
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

function sendAdminNotification($review) {
    $to = 'homeaidhomecareservices@gmail.com';
    $subject = 'New Review Pending Approval - HomeAid Services';
    $message = "A new review has been submitted and is pending approval:\n\n";
    $message .= "Name: " . $review['name'] . "\n";
    $message .= "Email: " . $review['email'] . "\n";
    $message .= "Service: " . $review['service'] . "\n";
    $message .= "Rating: " . $review['rating'] . "/5\n";
    $message .= "Message: " . $review['message'] . "\n";
    $message .= "Date: " . $review['date'] . "\n\n";
    $message .= "To approve this review, visit your admin panel.";
    
    $headers = 'From: noreply@homeaidservices.com' . "\r\n" .
               'Reply-To: ' . $review['email'] . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    mail($to, $subject, $message, $headers);
}
?>
