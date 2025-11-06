# Supabase Integration Setup

This guide will help you set up Supabase authentication with Google OAuth and the credit system.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Note down your project URL and anon key from the project settings

## 2. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add your domain to authorized origins:
   - `http://localhost:5173` (for development)
   - Your production domain
6. Add redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`

## 3. Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth Client ID and Client Secret
4. Set the redirect URL to: `https://your-project-id.supabase.co/auth/v1/callback`

## 4. Set up Database

1. In your Supabase dashboard, go to SQL Editor
2. Run the SQL script from `supabase-schema.sql` to create the necessary tables and policies

## 5. Environment Variables

Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase project URL and anon key.

## 6. Features

### Authentication
- Google OAuth sign-in
- Automatic user profile creation
- 5 free credits for new users
- User avatar and profile management

### Credit System
- Credits stored in Supabase database
- Real-time credit updates
- Credit transaction history
- Demo mode for non-authenticated users

### Database Tables

#### users
- `id`: UUID (primary key, references auth.users)
- `email`: User's email address
- `full_name`: User's display name
- `avatar_url`: User's profile picture
- `credits`: Current credit balance
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

#### credit_transactions
- `id`: UUID (primary key)
- `user_id`: UUID (references users.id)
- `amount`: Credit amount (positive for earned, negative for spent)
- `type`: Transaction type (earned, spent, purchased, bonus)
- `description`: Transaction description
- `module`: Module where credit was used
- `created_at`: Transaction timestamp

## 7. Testing

1. Start your development server: `npm run dev`
2. Click "Sign In" in the top bar
3. Sign in with Google
4. Verify you receive 5 free credits
5. Test using AI features to see credits being deducted
6. Check the credit history modal to see transaction records

## 8. Production Deployment

1. Update your Google OAuth settings with production domain
2. Update Supabase redirect URLs for production
3. Set environment variables in your production environment
4. Deploy your application

## Troubleshooting

### Common Issues

1. **Google OAuth not working**: Check redirect URIs and authorized origins
2. **Database errors**: Ensure RLS policies are set up correctly
3. **Credits not updating**: Check browser console for API errors
4. **User not created**: Verify the database schema is applied correctly

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

This will log authentication and credit system events to the console.
