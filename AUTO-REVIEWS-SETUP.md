# Automatic Reviews System Setup

This guide will help you set up the automatic reviews system for your HomeAid website.

## How It Works

The automatic reviews system uses Firebase Firestore (free tier) to store and retrieve reviews. When a user submits a review:

1. The review is immediately saved to Firebase
2. The review is displayed in the testimonial slider
3. All visitors will see the same reviews
4. No manual intervention is required

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name your project (e.g., "homeaid-reviews")
4. Follow the setup wizard (you can disable Google Analytics if you want)

### 2. Create a Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in production mode
4. Choose a location close to your target audience

### 3. Set Up Security Rules

1. Go to the "Rules" tab in Firestore
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

This allows anyone to read reviews and create new ones, but not modify or delete existing reviews.

### 4. Register Your Web App

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" and click the web icon (</>) 
4. Register your app with a nickname (e.g., "HomeAid Website")
5. Copy the Firebase configuration object

### 5. Update Your Code

1. Open the `auto-reviews.js` file
2. Replace the `firebaseConfig` object with your own configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 6. Deploy to Netlify

1. Push your updated code to GitHub
2. Netlify will automatically deploy the changes

## Testing

1. Submit a test review on your website
2. The review should appear immediately in the testimonial slider
3. Refresh the page - the review should still be there
4. Check from a different browser or device - the review should be visible there too

## Monitoring Reviews

You can monitor and manage reviews directly in the Firebase Console:

1. Go to your Firebase project
2. Click "Firestore Database" in the left sidebar
3. You'll see a "reviews" collection with all submitted reviews
4. You can delete inappropriate reviews if needed

## Costs

The Firebase free tier includes:
- 1GB of storage
- 50,000 reads per day
- 20,000 writes per day
- 20,000 deletes per day

This is more than enough for a typical small business website with reviews.

## Need Help?

If you need help setting up Firebase or have any questions, please reach out for assistance.
