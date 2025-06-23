// Vercel API Function for Reviews
// Uses Redis Cloud as database

import { createClient } from 'redis';

// Initialize Redis client
let redis;
async function getRedisClient() {
    if (!redis) {
        redis = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        
        redis.on('error', (err) => console.log('Redis Client Error', err));
        await redis.connect();
    }
    return redis;
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            return await getReviews(res);
        } else if (req.method === 'POST') {
            return await addReview(req, res);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getReviews(res) {
    try {
        const client = await getRedisClient();
        
        // Get all review keys
        const reviewKeys = await client.keys('review:*');
        const reviews = [];

        for (const key of reviewKeys) {
            const reviewData = await client.get(key);
            if (reviewData) {
                const review = JSON.parse(reviewData);
                if (review.approved !== false) {
                    reviews.push(review);
                }
            }
        }

        // Sort by date (newest first)
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        
        // Return default reviews if database fails
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
            },
            {
                id: 'default-3',
                name: 'Fatima Khan',
                service: 'IV Line',
                message: 'Professional staff and excellent care. Highly recommended!',
                rating: 5,
                date: '2024-06-05'
            }
        ];

        return res.status(200).json({ reviews: defaultReviews });
    }
}

async function addReview(req, res) {
    try {
        const { name, email, service, rating, message } = req.body;

        // Validate required fields
        if (!name || !email || !service || !rating || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating
        const numRating = parseInt(rating);
        if (numRating < 1 || numRating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Create review object
        const reviewId = 'review:' + Date.now() + Math.random().toString(36).substr(2, 9);
        const review = {
            id: reviewId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            service: service.trim(),
            rating: numRating,
            message: message.trim(),
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            approved: true, // Auto-approve all reviews
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        };

        // Store in Redis
        const client = await getRedisClient();
        await client.set(reviewId, JSON.stringify(review));

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: {
                id: review.id,
                name: review.name,
                service: review.service,
                message: review.message,
                rating: review.rating,
                date: review.date
            }
        });

    } catch (error) {
        console.error('Error adding review:', error);
        return res.status(500).json({ error: 'Failed to add review' });
    }
}
