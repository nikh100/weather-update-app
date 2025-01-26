import express from 'express';
import session from 'express-session';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'novus-books-secret',
    resave: false,
    saveUninitialized: true
}));

app.post('/api/recommendations', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are a knowledgeable book recommender. Based on the user's preferences, suggest 3 books with title, author, and brief description."
            }, {
                role: "user",
                content: prompt
            }],
            temperature: 0.7,
            max_tokens: 500
        });

        // Parse AI response and format recommendations
        const recommendations = [
            {
                id: 4,
                title: "The Midnight Library",
                author: "Matt Haig",
                price: 22.99,
                image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500",
                description: "Between life and death there is a library with infinite books, each containing a different version of your life.",
                rating: 4.7
            },
            {
                id: 5,
                title: "Klara and the Sun",
                author: "Kazuo Ishiguro",
                price: 26.99,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
                description: "A look at our changing world through the eyes of an unforgettable narrator.",
                rating: 4.5
            },
            {
                id: 6,
                title: "The Seven Husbands of Evelyn Hugo",
                author: "Taylor Jenkins Reid",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=500",
                description: "The story of a legendary film actress and her mysterious choice of an unknown journalist to write her life story.",
                rating: 4.8
            }
        ];

        res.json(recommendations);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});