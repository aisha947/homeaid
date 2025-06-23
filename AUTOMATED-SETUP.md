# Fully Automated Reviews System Setup

This system requires **zero manual work** - reviews appear automatically on the website when submitted.

## Quick Setup (5 minutes)

### Step 1: Create Airtable Database (Free)

1. Go to [airtable.com](https://airtable.com) and create a free account
2. Create a new base called "HomeAid Reviews"
3. Create a table called "Reviews" with these fields:
   - **Name** (Single line text)
   - **Email** (Email)
   - **Service** (Single select: IV Line, IV Medication, Blood Test, etc.)
   - **Message** (Long text)
   - **Rating** (Number, 1-5)
   - **Date** (Date)
   - **Approved** (Checkbox, default checked)

4. Get your API credentials:
   - Go to [airtable.com/api](https://airtable.com/api)
   - Select your base
   - Copy your **Base ID** (starts with "app...")
   - Go to [airtable.com/account](https://airtable.com/account)
   - Generate a **Personal Access Token**

### Step 2: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:
   - `AIRTABLE_API_KEY` = your personal access token
   - `AIRTABLE_BASE_ID` = your base ID (starts with "app...")

### Step 3: Deploy the Code

1. Add these files to your GitHub repository:
   - `netlify/functions/reviews.js`
   - `automated-reviews.js`

2. Update your `index.html` to use the new script:
   ```html
   <!-- Replace all other review scripts with this single line -->
   <script src="automated-reviews.js"></script>
   ```

3. Push to GitHub → Netlify auto-deploys

## How It Works

1. **Customer submits review** → Automatically saved to Airtable
2. **Review appears immediately** on website for all visitors
3. **You get email notification** via Netlify Forms
4. **Zero manual work required**

## Features

✅ **Fully automated** - No manual work needed
✅ **Real-time updates** - Reviews appear immediately
✅ **Spam protection** - Built-in validation
✅ **Email notifications** - You're notified of new reviews
✅ **Mobile responsive** - Works on all devices
✅ **Free to use** - Airtable free tier handles 1000+ reviews

## Optional: Review Moderation

If you want to approve reviews before they appear:

1. In Airtable, uncheck "Approved" by default for the field
2. New reviews won't appear until you check the "Approved" box
3. You can review and approve from your phone using the Airtable app

## Troubleshooting

- **Reviews not appearing?** Check Netlify environment variables
- **Function errors?** Check Netlify function logs
- **Airtable issues?** Verify API key and base ID

## Cost

- **Airtable**: Free (up to 1,200 records)
- **Netlify Functions**: Free (up to 125,000 requests/month)
- **Total cost**: $0/month for most small businesses

This system handles everything automatically - your client never needs to touch anything!
