const mongoose = require("mongoose")
const timestampsPlugin = require("mongoose-timestamp")

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true //removes any whitespace at the beginning and end of the name.
    },
    body:{
        type:String,
        required: true,
        trim:true
    },
    date: { type: Date, default: Date.now },
})
PostSchema.plugin(timestampsPlugin);

const Post = mongoose.model("Post",PostSchema)
module.exports = Post