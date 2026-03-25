const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (if needed)
app.use(express.static('public'));

// GET all posts
app.get('/api/posts', (req, res) => {
    try {
        const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'));
        const posts = JSON.parse(postsData);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET single post by ID
app.get('/api/posts/:id', (req, res) => {
    try {
        const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'));
        const posts = JSON.parse(postsData);
        const post = posts.find(p => p.id === parseInt(req.params.id));
        
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// POST - Create new post
app.post('/api/posts', (req, res) => {
    try {
        const { title, content, author } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        
        const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'));
        const posts = JSON.parse(postsData);
        
        const newPost = {
            id: posts.length + 1,
            title,
            content,
            author: author || 'Anonymous',
            date: new Date().toISOString().split('T')[0]
        };
        
        posts.push(newPost);
        fs.writeFileSync(path.join(__dirname, 'data', 'posts.json'), JSON.stringify(posts, null, 2));
        
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/api/posts`);
});