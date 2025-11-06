# Google Sheets Integration Setup Guide

## 🚨 **Current Issue**
The Google Sheets API requires authentication even for "public" sheets. The direct API approach is failing with 401 authentication errors.

## ✅ **Solution: Google Apps Script**

Google Apps Script is the easiest and most reliable way to submit data to Google Sheets without complex OAuth2 setup.

## 📋 **Step-by-Step Setup**

### **Step 1: Create Google Apps Script**

1. **Go to [Google Apps Script](https://script.google.com/)**
2. **Click "New Project"**
3. **Replace the default code** with the content from `google-apps-script.js` in this project
4. **Save the project** (Ctrl+S or Cmd+S)

### **Step 2: Configure the Script**

The script is already configured with your Google Sheet ID: `1NruO3pEd2HoXBOt8uv_vV7Jzu5p_r9CBE2RnlkUSSzU`

### **Step 3: Deploy as Web App**

1. **Click "Deploy"** → **"New deployment"**
2. **Choose type**: "Web app"
3. **Execute as**: "Me"
4. **Who has access**: "Anyone"
5. **Click "Deploy"**
6. **Copy the web app URL** (it will look like: `https://script.google.com/macros/s/AKfycbx.../exec`)

### **Step 4: Add URL to Environment Variables**

Add the web app URL to your Vercel environment variables:

**Variable Name**: `VITE_GOOGLE_APPS_SCRIPT_URL`
**Value**: Your web app URL from Step 3

### **Step 5: Test the Integration**

1. **Submit the startup form**
2. **Check the console** for detailed logs
3. **Verify data** appears in your Google Sheet

## 🔧 **Alternative: Fix Service Account Authentication**

If you prefer to use the service account approach, we need to:

1. **Share your Google Sheet** with the service account email:
   `mystartupform@protean-genius-444301-v7.iam.gserviceaccount.com`
2. **Give it Editor permissions**
3. **Fix the JWT signing** (requires proper RSA library implementation)

## 📊 **Expected Google Sheet Format**

Your sheet should have these columns in the first row:
1. **Timestamp**
2. **Full Name**
3. **Phone Number**
4. **Email ID**
5. **Startup Name**
6. **Features**
7. **Product Stage**
8. **Revenue**
9. **Submitted At**

## 🐛 **Debugging**

Check the browser console (F12 → Console) for detailed logs:
- `"Submitting via Apps Script to: ..."`
- `"Apps Script response status: ..."`
- `"Apps Script success: ..."`

## 🎯 **Recommendation**

**Use Google Apps Script** - it's much simpler, more reliable, and doesn't require complex authentication setup. Just follow the steps above to deploy the script and get your web app URL!

## 📞 **Need Help?**

If you encounter any issues:
1. Check the console logs for specific error messages
2. Verify the Apps Script deployment settings
3. Make sure the web app URL is correctly added to environment variables
4. Test the Apps Script directly in the Google Apps Script editor
