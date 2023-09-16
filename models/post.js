
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({ 
    title: String,
    desc: String,
    author: String,
    time: String,
});

module.exports = mongoose.model('Post', PostSchema);