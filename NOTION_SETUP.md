# Notion Integration Setup Guide

This guide will help you set up Notion integration for the startup form submission.

## Prerequisites

1. A Notion account
2. A Notion workspace where you can create databases

## Step 1: Create a Notion Database

1. Go to your Notion workspace
2. Create a new page or use an existing page
3. Add a new database with the following properties:

### Required Database Properties

| Property Name | Property Type | Description |
|---------------|---------------|-------------|
| Full Name | Title | The full name of the person submitting |
| Phone Number | Rich Text | Phone number |
| Email ID | Email | Email address |
| Startup Name | Rich Text | Name of the startup |
| Features | Rich Text | Description of startup features |
| Product Stage | Select | Current stage of the product |
| Revenue | Select | Revenue status |
| Submitted At | Date | When the form was submitted |

### Select Options

**Product Stage options:**
- Idea Stage
- MVP Development
- Beta Testing
- Launched
- Scaling

**Revenue options:**
- Pre-revenue
- $0-$1K/month
- $1K-$10K/month
- $10K-$100K/month
- $100K+/month

## Step 2: Get Notion API Credentials

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Productica Startup Form")
4. Select the workspace where your database is located
5. Click "Submit"
6. Copy the "Internal Integration Token" (this is your API key)

## Step 3: Share Database with Integration

1. Go to your Notion database
2. Click the "Share" button in the top right
3. Click "Add people, emails, groups, or integrations"
4. Search for your integration name and add it
5. Make sure it has "Can edit" permissions

## Step 4: Get Database ID

1. Open your Notion database in a web browser
2. The URL will look like: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
3. Copy the DATABASE_ID part (it's a 32-character string with hyphens)

## Step 5: Configure Environment Variables

### For Local Development

Create a `.env.local` file in your project root:

```env
VITE_NOTION_DATABASE_ID=your_database_id_here
VITE_NOTION_API_KEY=your_api_key_here
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add the following variables:

| Name | Value |
|------|-------|
| `VITE_NOTION_DATABASE_ID` | Your database ID |
| `VITE_NOTION_API_KEY` | Your integration token |

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Open the startup form
3. Fill out and submit the form
4. Check your Notion database for the new entry

## Troubleshooting

### Common Issues

1. **"Notion API credentials not configured"**
   - Make sure you've set both environment variables
   - Restart your development server after adding them

2. **"Notion API error: 401"**
   - Check that your API key is correct
   - Make sure the integration is shared with the database

3. **"Notion API error: 404"**
   - Verify the database ID is correct
   - Make sure the database exists and is accessible

4. **"Notion API error: 400"**
   - Check that all required database properties exist
   - Verify property names match exactly (case-sensitive)

### Database Property Names

Make sure your Notion database properties match these exact names:
- Full Name
- Phone Number
- Email ID
- Startup Name
- Features
- Product Stage
- Revenue
- Submitted At

## Security Notes

- Never commit your API keys to version control
- Use environment variables for all sensitive data
- The Notion API key should be kept secure and not shared publicly
