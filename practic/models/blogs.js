const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    passward: {
        type: String,
        required: true
    },
    chats1:{
        type: String,
        required: true
    },
    chats2:{
        type: String,
        required: true
    },
    chats3:{
        type: String,
        required: true
    },
}, {timestamps: true});
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;