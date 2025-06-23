# Deployment Checklist - Automated Reviews

## Pre-Deployment Setup ✅

- [ ] Airtable account created
- [ ] "HomeAid Reviews" base created with correct fields
- [ ] Personal Access Token generated
- [ ] Base ID copied
- [ ] Netlify environment variables added

## Files to Deploy ✅

- [ ] `netlify/functions/reviews.js` - Backend function
- [ ] `automated-reviews.js` - Frontend system
- [ ] Update `index.html` to use new script

## Code Changes Needed

### In your `index.html`, replace this section:

**REMOVE these lines:**
```html
<script src="debug-reviews.js"></script>
<script src="simple-reviews.js"></script>
<script src="fix-all-reviews.js"></script>
<script src="backup-form.js"></script>
```

**ADD this single line:**
```html
<script src="automated-reviews.js"></script>
```

## Deployment Steps

1. **Add files to GitHub:**
   ```bash
   git add netlify/functions/reviews.js
   git add automated-reviews.js
   git commit -m "Add automated reviews system"
   ```

2. **Update index.html:**
   - Remove old review scripts
   - Add new automated-reviews.js script

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

4. **Netlify auto-deploys** (usually takes 1-2 minutes)

## Testing Checklist

After deployment:

- [ ] Website loads without errors
- [ ] Reviews section displays existing reviews
- [ ] "Share Your Experience" button opens modal
- [ ] Form validation works (try submitting empty form)
- [ ] Star rating works (click stars)
- [ ] Submit a test review
- [ ] Review appears immediately on site
- [ ] Check Airtable - new review should be there
- [ ] Check email - should receive Netlify form notification

## Success Indicators

✅ **Reviews display properly** on the website  
✅ **New reviews appear instantly** after submission  
✅ **Airtable receives data** automatically  
✅ **Email notifications work** via Netlify Forms  
✅ **No manual work required** for client  

## If Something Goes Wrong

### Reviews not displaying?
1. Check browser console for errors
2. Verify `automated-reviews.js` is loading
3. Check Netlify function logs

### Form not submitting?
1. Check network tab in browser dev tools
2. Verify Netlify environment variables
3. Test Airtable API connection

### Airtable not receiving data?
1. Double-check API token and base ID
2. Verify table name is exactly "Reviews"
3. Check field names match exactly

## Client Handover

Once everything works:

1. **Show client the live website**
2. **Demonstrate review submission**
3. **Show them Airtable dashboard** (they can bookmark this)
4. **Explain they get email notifications**
5. **Confirm zero maintenance required**

## Support

If you need help:
- Check Netlify function logs
- Verify Airtable API documentation
- Test with sample data first

**The system is designed to be bulletproof once set up correctly!**
