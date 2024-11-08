const mongoose = require("mongoose");
const timestampsPlugin = require("mongoose-timestamp");

// Assuming you have a User model that represents users
const User = require('./User'); // Modify the path as needed

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes any whitespace at the beginning and end
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    date: { type: Date, default: Date.now },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true, // Ensure a user is always associated with the post
    }
});

PostSchema.plugin(timestampsPlugin);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
