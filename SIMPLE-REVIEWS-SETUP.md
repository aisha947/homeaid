# Simple Reviews System Setup

This guide explains how to set up the simple reviews system for your HomeAid website.

## How It Works

This system uses Netlify Forms to collect review submissions. When a user submits a review:

1. The review is immediately displayed in the testimonial slider
2. The review is submitted to Netlify Forms for your records
3. You can add the review to your `reviews.json` file to make it permanent

## Setup Steps

### 1. Enable Netlify Forms

1. Log in to your Netlify dashboard
2. Go to your site settings
3. Make sure Forms are enabled (they should be by default)

### 2. Update Your Reviews

When you receive new review submissions:

1. Go to your Netlify dashboard
2. Click on "Forms" in the top navigation
3. You'll see all form submissions, including reviews
4. To make a review permanent for all visitors, add it to your `reviews.json` file

## Adding Reviews to reviews.json

To add a review to your `reviews.json` file:

1. Open the `reviews.json` file in your GitHub repository
2. Add a new review entry in this format:

```json
{
  "name": "Customer Name",
  "service": "Service Used",
  "message": "Review message text",
  "rating": 5,
  "date": "YYYY-MM-DD"
}
```

3. Commit and push the changes to GitHub
4. Netlify will automatically deploy the updated site

## Important Notes

- Reviews are immediately displayed when submitted
- To make reviews permanent and visible to all visitors, add them to `reviews.json`
- All reviews in the `reviews.json` file will be visible to all visitors

## Need Help?

If you need any assistance with the reviews system, please reach out for help.
