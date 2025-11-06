import { StartupData } from '@/hooks/useStartupContext';

export interface NotionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Notion API configuration
const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;
const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;

export const submitToNotion = async (startupData: StartupData): Promise<NotionResponse> => {
  try {
    console.log('Submitting to Notion...');
    console.log('Data being sent:', startupData);

    if (!NOTION_DATABASE_ID || !NOTION_API_KEY) {
      throw new Error('Notion API credentials not configured. Please set VITE_NOTION_DATABASE_ID and VITE_NOTION_API_KEY environment variables.');
    }

    // Prepare the data for Notion API
    const notionData = {
      parent: {
        database_id: NOTION_DATABASE_ID
      },
      properties: {
        'Full Name': {
          title: [
            {
              text: {
                content: startupData.fullName || ''
              }
            }
          ]
        },
        'Phone Number': {
          rich_text: [
            {
              text: {
                content: startupData.phoneNumber || ''
              }
            }
          ]
        },
        'Email ID': {
          email: startupData.emailId || ''
        },
        'Startup Name': {
          rich_text: [
            {
              text: {
                content: startupData.startupName || ''
              }
            }
          ]
        },
        'Features': {
          rich_text: [
            {
              text: {
                content: startupData.features || ''
              }
            }
          ]
        },
        'Product Stage': {
          select: {
            name: startupData.productStage || 'Idea Stage'
          }
        },
        'Revenue': {
          select: {
            name: startupData.revenue || 'Pre-revenue'
          }
        },
        'Submitted At': {
          date: {
            start: startupData.submittedAt || new Date().toISOString()
          }
        }
      }
    };

    console.log('Notion payload:', notionData);

    const response = await fetch(`${NOTION_API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(notionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API error response:', errorText);
      throw new Error(`Notion API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Notion API success:', result);
    
    return {
      success: true,
      message: 'Startup details successfully submitted to Notion!',
      data: result
    };
    
  } catch (error) {
    console.error('Error submitting to Notion:', error);
    return {
      success: false,
      message: `Failed to submit to Notion: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Test function to check if Notion API is accessible
export const testNotionConnection = async (): Promise<{ accessible: boolean; error?: string }> => {
  try {
    console.log('Testing Notion API connection...');
    
    if (!NOTION_DATABASE_ID || !NOTION_API_KEY) {
      return { 
        accessible: false, 
        error: 'Notion API credentials not configured' 
      };
    }

    const response = await fetch(`${NOTION_API_URL}/databases/${NOTION_DATABASE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });
    
    console.log('Notion test response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Notion test response data:', result);
      return { accessible: true };
    } else {
      const errorText = await response.text();
      return { accessible: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('Notion test connection failed:', error);
    return { 
      accessible: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
