<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address.";
        exit;
    }

    // Set the recipient email address - this is where form submissions will be sent
    $recipient = "homeaidhomecareservices@gmail.com";

    // Set the email subject
    $subject = "New Contact Request from HomeAid Website: $name";

    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $email_headers = "From: HomeAid Website <noreply@homeaidservices.com>\n";
    $email_headers .= "Reply-To: $name <$email>";

    // Send the email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code
        http_response_code(200);
        echo "Thank You! Your message has been sent. We'll get back to you shortly.";
        
        // Log the submission (optional)
        $log_file = "contact_submissions.log";
        $log_message = date("Y-m-d H:i:s") . " - New contact from: $name ($email)\n";
        file_put_contents($log_file, $log_message, FILE_APPEND);
    } else {
        // Set a 500 (internal server error) response code
        http_response_code(500);
        echo "Oops! Something went wrong, we couldn't send your message. Please try again later.";
    }
} else {
    // Not a POST request, set a 403 (forbidden) response code
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
