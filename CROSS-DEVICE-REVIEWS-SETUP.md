# Cross-Device Reviews System Setup

This guide will help you set up the cross-device reviews system for your HomeAid website.

## How It Works

The cross-device reviews system uses Netlify Functions and MongoDB to store and retrieve reviews. When a user submits a review:

1. The review is saved to a MongoDB database
2. The review is displayed in the testimonial slider
3. All visitors on any device will see the same reviews
4. No manual intervention is required

## Setup Steps

### 1. Create a MongoDB Atlas Account (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (the free tier is sufficient)
4. Create a database user with password
5. Add your IP address to the IP whitelist (or allow access from anywhere)
6. Get your MongoDB connection string

### 2. Set Up Netlify Functions

1. Log in to your Netlify dashboard
2. Go to your site settings
3. Go to "Environment variables"
4. Add a new variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string (replace `<username>` and `<password>` with your actual credentials)

### 3. Deploy to Netlify

1. Push your updated code to GitHub
2. Netlify will automatically deploy the changes and set up the serverless functions

### 4. Test the System

1. Submit a test review on your website
2. The review should appear immediately in the testimonial slider
3. Check from a different browser or device - the review should be visible there too

## Files Included

- `netlify/functions/reviews.js` - Serverless function to handle reviews
- `cross-device-reviews.js` - Frontend code to interact with the API
- `netlify.toml` - Netlify configuration file
- `package.json` - Dependencies for the serverless function

## Costs

- MongoDB Atlas free tier includes 512MB of storage
- Netlify free tier includes 125,000 function invocations per month
- This is more than enough for a typical small business website with reviews

## Need Help?

If you need help setting up MongoDB or have any questions about the system, please reach out for assistance.
