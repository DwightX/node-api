const errors = require('restify-errors');
const Post = require('../models/Post');
const rjwt = require('restify-jwt-community');
const config = require('../config');

module.exports = server => {

    // Get all posts - No token required
    server.get('/post', async (req, res, next) => {
        try {
            const posts = await Post.find({});
            res.send(posts);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Get single post - No token required
    server.get('/post/:id', async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return next(new errors.ResourceNotFoundError(`No post found with the id ${req.params.id}`));
            }
            res.send(post);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No post found with the id ${req.params.id}`));
        }
    });

    // Make new post - Token required
    server.post('/post', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const post = new Post({
                title: req.body.title,
                body: req.body.body,
                date: req.body.date
            });
            const newPost = await post.save();
            res.send(201, newPost); // Send back the created post
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

    // Delete post - Token required
    server.del('/post/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const post = await Post.findOneAndDelete({ _id: req.params.id });
            
            // Check if post was found and deleted
            if (!post) {
                res.send(404, new errors.ResourceNotFoundError(`No post found with the id ${req.params.id}`));
                return;
            }
            
            res.send(204); // No content response
            next();
        } catch (err) {
            res.send(500, new errors.InternalError(err.message));
            next();
        }
    });

    // Update post - Token required
    server.put('/post/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        // Check for JSON
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            if (!post) {
                return next(new errors.ResourceNotFoundError(`No post found with the id ${req.params.id}`));
            }
            res.send(200, post);  // Send back the updated post
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No post found with the id ${req.params.id}`));
        }
    });

};
