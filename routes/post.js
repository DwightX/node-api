const errors = require('restify-errors')
const Post = require('../models/Post')

module.exports = server => {

    // Get all post
    server.get('/post', async (req, res) => {
        try {
            const post = await Post.find({})
            res.send(post)
            next()
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }
    });

    // make new post
    server.post('/post', async (req, res) => {
        // Check for JSON - fixed typo in content-type check
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const post = new Post({
                title: req.body.title,
                body: req.body.body,
                date: req.body.date
            })
            const newPost = await post.save()
            res.send(201, newPost)  // Send back the created customer
            return next()
        } catch (err) {
            return next(new errors.InternalError(err.message))
        }
    });

    //Delete Post
    server.del('/post/:id', async (req, res) => {
        try { 
            const post = await Post.findOneAndDelete({ _id: req.params.id });
            
            // Check if customer was found and deleted
            if (!post) {
                res.send(404, new errors.ResourceNotFoundError(`No post with the id of ${req.params.id}`));
                return;
            }
            
            res.send(204); // No content response
        } catch (err) {
            res.send(500, new errors.InternalError(err.message));
        }
    });

    //update post
    server.put('/post/:id', async (req, res) => {
        // Check for JSON - fixed typo in content-type check
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const post = await Post.findOneAndUpdate({_id:req.params.id}, req.body)
            res.send(201)  // Send back the created customer
            next()
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No post with the id of ${req.params.id    }`))
        }
    });


}