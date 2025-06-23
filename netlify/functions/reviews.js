// Netlify Function for Reviews
// Handles GET (fetch reviews) and POST (add reviews)

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Reviews';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    return await getReviews(headers);
  } else if (event.httpMethod === 'POST') {
    return await addReview(event, headers);
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};

async function getReviews(headers) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=desc`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Airtable');
    }

    const data = await response.json();
    
    // Transform Airtable data to our format
    const reviews = data.records
      .filter(record => record.fields.Approved !== false) // Only approved reviews
      .map(record => ({
        id: record.id,
        name: record.fields.Name,
        service: record.fields.Service,
        message: record.fields.Message,
        rating: record.fields.Rating,
        date: record.fields.Date,
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reviews }),
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    // Return default reviews if Airtable fails
    const defaultReviews = [
      {
        id: 'default-1',
        name: 'Sarah Ahmed',
        service: 'IV Medication',
        message: 'Excellent service! The nurse was very professional and made me feel comfortable throughout the treatment.',
        rating: 5,
        date: '2024-06-15'
      },
      {
        id: 'default-2',
        name: 'Muhammad Ali',
        service: 'Blood Test',
        message: 'Quick and efficient service. Very satisfied with the home visit.',
        rating: 5,
        date: '2024-06-10'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reviews: defaultReviews }),
    };
  }
}

async function addReview(event, headers) {
  try {
    const body = JSON.parse(event.body);
    
    // Validate required fields
    if (!body.name || !body.service || !body.message || !body.rating) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Add to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Name: body.name,
            Email: body.email,
            Service: body.service,
            Message: body.message,
            Rating: parseInt(body.rating),
            Date: new Date().toISOString().split('T')[0],
            Approved: true, // Auto-approve all reviews
          },
        }),
      }
    );

    if (!airtableResponse.ok) {
      throw new Error('Failed to add to Airtable');
    }

    const newRecord = await airtableResponse.json();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Review added successfully',
        review: {
          id: newRecord.id,
          name: newRecord.fields.Name,
          service: newRecord.fields.Service,
          message: newRecord.fields.Message,
          rating: newRecord.fields.Rating,
          date: newRecord.fields.Date,
        },
      }),
    };
  } catch (error) {
    console.error('Error adding review:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add review' }),
    };
  }
}
