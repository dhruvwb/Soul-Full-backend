# 🔥 Firebase Setup for Render Deployment

## Step 1: Encode Firebase Key to Base64

Since we can't commit `firebase-key.json` to GitHub, we need to convert it to a base64 string for Render environment variables.

### Option A: Using PowerShell (Windows - Quick)
```powershell
# Open PowerShell in Backend folder and run:
$content = Get-Content firebase-key.json -Raw
$encoded = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
$encoded | Set-Clipboard
# Copy the extremely long string from clipboard
```

### Option B: Using Base64 Online Tool (Easy)
1. Open: https://www.base64encode.org/
2. Paste contents of `firebase-key.json`
3. Click "Encode"
4. Copy the base64 string

### Option C: Using Node.js (Quick)
```bash
cd Backend
node -e "console.log(Buffer.from(require('fs').readFileSync('firebase-key.json')).toString('base64'))" | clip
```

**Result**: You'll have a very long base64 string (starts with `eyJ0eXBlI...` and ends with `...==`)

---

## Step 2: Add to Render Environment Variable

1. Go to: https://dashboard.render.com
2. Click your backend service (`soul-full-backend`)
3. Click **"Environment"** (left sidebar)
4. Click **"Edit Environment"**
5. Add new variable:
   ```
   Variable Name: FIREBASE_SERVICE_ACCOUNT
   Value: [Paste your base64 string here]
   ```
6. Click **"Save Changes"**
7. Render will **auto-redeploy** in 2-3 minutes

---

## Step 3: Verify on Render

1. Go to **"Logs"** tab on Render dashboard
2. Wait for deployment to complete
3. Look for: `✅ Firebase Admin SDK initialized successfully`
4. If you see it → Success! 🎉

---

## Testing Locally

Your backend will work locally with the file:
```bash
cd Backend
npm start
# Should show: ✅ Firebase Admin SDK initialized successfully
```

---

## Summary

| Location | Method | Credentials |
|----------|--------|-------------|
| **Local** | `firebase-key.json` file | Use as-is ✅ |
| **Render** | `FIREBASE_SERVICE_ACCOUNT` env var | Base64 encoded string ✅ |
| **GitHub** | ❌ NEVER commit | Protected by .gitignore ✅ |

---

**Once Render redeploys, your backend will be connected to Firebase Firestore! 🔥**
