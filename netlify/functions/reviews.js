// Netlify Function to handle reviews
const { MongoClient } = require('mongodb');

// MongoDB connection string (you'll need to set this in Netlify environment variables)
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'homeaid';
const COLLECTION_NAME = 'reviews';

let cachedDb = null;

// Connect to database
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  // For preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);
    
    // GET request - retrieve all reviews
    if (event.httpMethod === 'GET') {
      const reviews = await collection.find({}).sort({ timestamp: -1 }).toArray();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ reviews }),
      };
    }
    
    // POST request - add a new review
    if (event.httpMethod === 'POST') {
      const reviewData = JSON.parse(event.body);
      
      // Add timestamp
      reviewData.timestamp = new Date().toISOString();
      
      // Insert into database
      await collection.insertOne(reviewData);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Review added successfully',
          review: reviewData 
        }),
      };
    }
    
    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.log('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
