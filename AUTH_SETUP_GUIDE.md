# 🔐 Complete Authentication Setup Guide

Follow these steps to get Google OAuth authentication working with your Supabase project.

## Step 1: Update Environment Variables

Replace the placeholder values in your `.env` file with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 2: Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `users` table for storing user profiles and credits
- `credit_transactions` table for tracking credit usage
- Row Level Security (RLS) policies
- Indexes for better performance

## Step 3: Configure Google OAuth

### 3.1 Set up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application type** to **Web application**
6. Add **Authorized JavaScript origins**:
   - `http://localhost:8080` (for development)
   - `https://your-vercel-app.vercel.app` (for production)
7. Add **Authorized redirect URIs**:
   - `https://your-project-id.supabase.co/auth/v1/callback`
8. Copy your **Client ID** and **Client Secret**

### 3.2 Configure Supabase Auth

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google **Client ID** and **Client Secret**
5. Set **Redirect URL** to: `https://your-project-id.supabase.co/auth/v1/callback`
6. Click **Save**

## Step 4: Test Authentication

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8080
3. Click **Sign In** in the top bar
4. Click **Sign in with Google**
5. Complete the OAuth flow
6. You should receive 5 free credits automatically!

## Step 5: Verify Database

After successful authentication, check your Supabase dashboard:

1. Go to **Table Editor**
2. Check the `users` table - you should see your user record
3. Check the `credit_transactions` table - you should see the welcome bonus transaction

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Make sure the redirect URI in Google Console matches exactly
   - Check for typos in the URL

2. **"Client ID not found"**
   - Verify the Client ID is correct in Supabase
   - Make sure Google+ API is enabled

3. **"Database error"**
   - Ensure the database schema was run successfully
   - Check RLS policies are enabled

4. **"Environment variables not loading"**
   - Restart the development server after updating .env
   - Check for typos in variable names

### Debug Mode:

Add this to your `.env` file to enable debug logging:
```env
VITE_DEBUG=true
```

## Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard
2. Update Google OAuth settings with production domain
3. Update Supabase redirect URLs for production

## Success Indicators

✅ User can sign in with Google  
✅ User appears in `users` table  
✅ User receives 5 free credits  
✅ Credit transactions are recorded  
✅ User can use AI features  
✅ Credits are deducted properly  

---

**Need help?** Check the browser console for error messages and refer to the Supabase documentation.
