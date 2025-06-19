<?php
echo "<h2>HomeAid Setup Test</h2>";

// Test 1: Check if PHP mail function exists
echo "<h3>1. Email Function Test</h3>";
if (function_exists('mail')) {
    echo "✅ PHP mail() function is available<br>";
} else {
    echo "❌ PHP mail() function is not available<br>";
}

// Test 2: Check file permissions
echo "<h3>2. File Permissions Test</h3>";
$files_to_check = ['contact_submissions.log', 'reviews.json'];

foreach ($files_to_check as $file) {
    if (file_exists($file)) {
        if (is_writable($file)) {
            echo "✅ $file exists and is writable<br>";
        } else {
            echo "❌ $file exists but is not writable<br>";
        }
    } else {
        // Try to create the file
        if (file_put_contents($file, '') !== false) {
            echo "✅ $file created successfully<br>";
        } else {
            echo "❌ Cannot create $file<br>";
        }
    }
}

// Test 3: Check directory permissions
echo "<h3>3. Directory Permissions Test</h3>";
if (is_writable('.')) {
    echo "✅ Current directory is writable<br>";
} else {
    echo "❌ Current directory is not writable<br>";
}

// Test 4: Test review handler
echo "<h3>4. Review Handler Test</h3>";
if (file_exists('review-handler.php')) {
    echo "✅ review-handler.php exists<br>";
} else {
    echo "❌ review-handler.php not found<br>";
}

// Test 5: Test form handler
echo "<h3>5. Form Handler Test</h3>";
if (file_exists('form-handler.php')) {
    echo "✅ form-handler.php exists<br>";
} else {
    echo "❌ form-handler.php not found<br>";
}

echo "<h3>6. Server Information</h3>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
?>
