<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $name = isset($_POST["name"]) ? strip_tags(trim($_POST["name"])) : '';
    $email = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : '';
    $message = isset($_POST["message"]) ? strip_tags(trim($_POST["message"])) : '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Please fill in all required fields.";
        exit;
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address.";
        exit;
    }

    // Set the recipient email address
    $recipient = "homeaidhomecareservices@gmail.com";

    // Set the email subject
    $subject = "New Contact Request from HomeAid Website: " . $name;

    // Build the email content with better formatting
    $email_content = "You have received a new contact form submission from your HomeAid website.\n\n";
    $email_content .= "Contact Details:\n";
    $email_content .= "================\n";
    $email_content .= "Name: " . $name . "\n";
    $email_content .= "Email: " . $email . "\n";
    $email_content .= "Phone: " . $phone . "\n\n";
    $email_content .= "Message:\n";
    $email_content .= "=========\n";
    $email_content .= $message . "\n\n";
    $email_content .= "Submitted on: " . date("Y-m-d H:i:s") . "\n";
    $email_content .= "From IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

    // Log the submission
    $log_file = "contact_submissions.log";
    $log_message = date("Y-m-d H:i:s") . " - New contact from: $name ($email)\n";
    $log_message .= "Phone: $phone\n";
    $log_message .= "Message: $message\n";
    $log_message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $log_message .= "---------------------------------------------\n";
    
    // Log the submission
    file_put_contents($log_file, $log_message, FILE_APPEND | LOCK_EX);
    
    // Set proper email headers
    $headers = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-type: text/plain; charset=UTF-8";
    $headers[] = "From: HomeAid Website <noreply@homeaidservices.com>";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    $email_headers = implode("\r\n", $headers);
    
    // Try to send email
    $email_sent = false;
    
    if (function_exists('mail')) {
        $email_sent = mail($recipient, $subject, $email_content, $email_headers);
    }
    
    // Set response
    http_response_code(200);
    if ($email_sent) {
        echo "Thank You! Your message has been sent successfully. We'll get back to you shortly.";
    } else {
        // For local development or servers without mail configured
        echo "Thank You! Your message has been received and logged. We'll get back to you shortly.";
    }
    
} else {
    // Not a POST request
    http_response_code(403);
    echo "Invalid request method.";
}
?>
