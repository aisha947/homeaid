# Managing Reviews for HomeAid Website

This document explains how to manage reviews for your HomeAid website.

## How Reviews Work

1. The website loads reviews from the `reviews.json` file
2. All visitors see the same reviews from this file
3. When users submit new reviews, they need to be manually added to the JSON file

## Adding New Reviews

When a user submits a review on your website:

1. The review will appear temporarily for that user
2. You'll see instructions on how to add it permanently
3. You need to update the `reviews.json` file with the new review
4. Push the updated file to GitHub
5. Netlify will automatically deploy the updated reviews

## Using the Admin Tool

1. Open `admin-reviews.html` locally (this file is not meant to be public)
2. Click "Load Current Reviews" to see existing reviews
3. Use the form to add new reviews to the JSON
4. Copy the updated JSON
5. Update the `reviews.json` file in your GitHub repository

## JSON File Structure

The `reviews.json` file has this structure:

```json
{
  "reviews": [
    {
      "name": "Customer Name",
      "service": "Service Used",
      "message": "Review message text",
      "rating": 5,
      "date": "2025-06-19"
    },
    // More reviews...
  ]
}
```

## Important Notes

- Keep the JSON format valid (use the admin tool to ensure this)
- The date should be in YYYY-MM-DD format
- Rating should be a number from 1 to 5
- All reviews in the JSON file will be visible to all visitors
