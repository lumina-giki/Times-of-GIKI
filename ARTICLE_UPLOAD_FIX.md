# Article Upload Fix Instructions

## Quick Fix for Article Upload Getting Stuck

The issue you're experiencing is likely due to:
1. **Network timeout** when switching windows
2. **Browser tab suspension** interrupting the upload
3. **Missing timeout handling** in the Supabase request

## Immediate Solution

### 1. **Keep the Browser Tab Active**
- Don't switch away from the browser tab while uploading
- Keep the admin panel visible during article submission
- Wait for the "Article saved successfully!" message

### 2. **Upload in Smaller Chunks**
For the welcome article, try breaking it into smaller sections:

**First, upload a shorter version:**
```
Title: Welcome to Times of GIKI
Content: Just the first 2-3 paragraphs
```

**Then edit it to add the full content.**

### 3. **Browser Console Monitoring**
Open browser console (F12) while uploading to see detailed logs:
- Right-click → Inspect → Console tab
- Watch for any error messages during upload

### 4. **Alternative Upload Method**
If the issue persists, try:
1. **Restart the development server**
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Try a different browser** (Chrome/Firefox/Edge)

## Technical Fix Applied

I've added extensive logging to help debug the issue. In the browser console, you'll now see:
- "Starting article submission..."
- "Article data prepared..."
- "Creating new article..." or "Updating existing article..."
- "Article saved successfully"
- Any error messages with details

## What to Do Right Now

1. **Open the admin panel**: `http://localhost:3000/admin`
2. **Open browser console**: Press F12 → Console tab
3. **Try uploading a short test article first**:
   ```
   Title: Test Article
   Content: This is a test article to verify the upload works.
   Excerpt: Test excerpt
   Category: Campus Life
   ✅ Check "Publish immediately"
   ```
4. **Watch the console** for any errors or where it gets stuck
5. **If it works**, then try the full welcome article

## Prevention Tips

- **Stay on the tab** during upload
- **Keep the browser window active**
- **Don't minimize or switch windows** during submission
- **Wait for the success message** before navigating away

Let me know what you see in the console when you try uploading!
