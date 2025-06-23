# Complete Airtable Setup Guide for HomeAid Reviews

## Step 1: Create Airtable Database (5 minutes)

### 1.1 Create Account
1. Go to [airtable.com](https://airtable.com)
2. Click "Sign up for free"
3. Use your email to create account (no credit card needed)

### 1.2 Create Base
1. Click "Create a base"
2. Choose "Start from scratch"
3. Name it: **"HomeAid Reviews"**

### 1.3 Setup Table Structure
1. Rename the default table to: **"Reviews"**
2. Create these fields (click + to add fields):

| Field Name | Field Type | Options |
|------------|------------|---------|
| **Name** | Single line text | Required |
| **Email** | Email | Required |
| **Service** | Single select | IV Line, IV Medication, Blood Test, Injection, Wound Care, Physiotherapy, Nursing Care, Other |
| **Message** | Long text | Required |
| **Rating** | Number | Integer, Min: 1, Max: 5 |
| **Date** | Date | Auto-fill with today's date |
| **Approved** | Checkbox | Default: Checked |

### 1.4 Add Sample Data (Optional)
Add a few sample reviews to test:
- Name: "Sarah Ahmed", Service: "IV Medication", Rating: 5, etc.

## Step 2: Get API Credentials

### 2.1 Get Base ID
1. Go to [airtable.com/api](https://airtable.com/api)
2. Click on your "HomeAid Reviews" base
3. Copy the **Base ID** (starts with "app...")
4. Save it somewhere - you'll need this

### 2.2 Create Personal Access Token
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create new token"
3. Name: "HomeAid Website"
4. Add these scopes:
   - `data.records:read`
   - `data.records:write`
5. Add access to your "HomeAid Reviews" base
6. Click "Create token"
7. **Copy the token immediately** (you can't see it again)

## Step 3: Configure Netlify

### 3.1 Add Environment Variables
1. Go to your Netlify dashboard
2. Select your HomeAid site
3. Go to **Site settings** → **Environment variables**
4. Click "Add a variable" and add:

**Variable 1:**
- Key: `AIRTABLE_API_KEY`
- Value: [Your personal access token from step 2.2]

**Variable 2:**
- Key: `AIRTABLE_BASE_ID`
- Value: [Your base ID from step 2.1]

5. Click "Save"

## Step 4: Deploy Code

### 4.1 Add Files to GitHub
Add these files to your repository:
- `netlify/functions/reviews.js` ✓ (already created)
- `automated-reviews.js` ✓ (already created)

### 4.2 Update index.html
Replace your current review scripts with:
```html
<!-- Remove all these old scripts -->
<!-- <script src="simple-reviews.js"></script> -->
<!-- <script src="debug-reviews.js"></script> -->
<!-- <script src="fix-all-reviews.js"></script> -->

<!-- Add this single line instead -->
<script src="automated-reviews.js"></script>
```

### 4.3 Push to GitHub
```bash
git add .
git commit -m "Add automated reviews system"
git push origin main
```

Netlify will automatically deploy!

## Step 5: Test Everything

### 5.1 Test Review Submission
1. Go to your live website
2. Click "Share Your Experience"
3. Fill out and submit a review
4. Check if it appears immediately on the site

### 5.2 Verify Airtable
1. Go to your Airtable base
2. Check if the new review appears in the table
3. You should see all the data populated

### 5.3 Check Email Notifications
- You should receive an email via Netlify Forms
- This gives you a backup notification system

## Troubleshooting

### Reviews Not Appearing?
1. Check Netlify function logs:
   - Netlify Dashboard → Functions → View logs
2. Verify environment variables are set correctly
3. Check Airtable API token permissions

### Function Errors?
1. Make sure `netlify/functions/reviews.js` is in the right folder
2. Check that environment variables match exactly
3. Verify Airtable base ID and table name

### Airtable Connection Issues?
1. Regenerate your personal access token
2. Double-check base ID from the API documentation
3. Ensure table name is exactly "Reviews"

## Client Benefits

✅ **Zero maintenance** - Reviews appear automatically  
✅ **Mobile management** - Client can view reviews on Airtable mobile app  
✅ **Data backup** - All reviews safely stored in Airtable  
✅ **Email notifications** - Client gets notified of new reviews  
✅ **Professional appearance** - Clean, fast-loading reviews  

## Optional: Review Moderation

If client wants to approve reviews before they appear:

1. In Airtable, edit the "Approved" field
2. Set default value to "unchecked"
3. New reviews won't appear until client checks the box
4. Client can approve from phone using Airtable app

## Cost Breakdown

- **Airtable**: Free (up to 1,200 reviews)
- **Netlify Functions**: Free (up to 125,000 requests/month)
- **Total**: $0/month

**This setup will handle years of reviews at zero cost!**
