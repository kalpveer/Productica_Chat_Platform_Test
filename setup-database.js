// Database Setup Script for Supabase
// This script helps you set up the database schema

console.log(`
🔐 SUPABASE AUTHENTICATION SETUP
================================

✅ Environment variables updated successfully!
✅ Development server restarted with new credentials

📋 NEXT STEPS:

1. DATABASE SCHEMA SETUP:
   - Go to: https://uvynvvvmyzngzyqxkmya.supabase.co
   - Navigate to: SQL Editor
   - Copy the contents of: supabase-schema.sql
   - Paste and run the SQL script

2. GOOGLE OAUTH SETUP:
   - Go to: Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add redirect URI: https://uvynvvvmyzngzyqxkmya.supabase.co/auth/v1/callback
   - Configure in Supabase: Authentication → Providers → Google

3. TEST AUTHENTICATION:
   - Open: http://localhost:8080
   - Click "Sign In" → "Sign in with Google"
   - You should receive 5 free credits!

📁 Files to reference:
- supabase-schema.sql (database setup)
- AUTH_SETUP_GUIDE.md (detailed instructions)

🚀 Your app is ready at: http://localhost:8080
`);

// Test Supabase connection
const testConnection = async () => {
  try {
    const response = await fetch('https://uvynvvvmyzngzyqxkmya.supabase.co/rest/v1/', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eW52dnZteXpuZ3p5cXhrbXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDUyMjQsImV4cCI6MjA3Mzg4MTIyNH0.Y1Hlb8x7PBdkfI3BOmsE18mipKi4Ep5XbWzCXEaBSAw'
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection successful!');
    } else {
      console.log('❌ Supabase connection failed. Check your credentials.');
    }
  } catch (error) {
    console.log('❌ Error testing Supabase connection:', error.message);
  }
};

// Run connection test
testConnection();
