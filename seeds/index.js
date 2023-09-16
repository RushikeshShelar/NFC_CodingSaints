const mongoose = require('mongoose');
const Post = require('../models/post');
const PostContent = require('./postContent');

mongoose.connect('mongodb://127.0.0.1:27017/finance', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const seedPosts = async () => {
    await Post.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const item = new Post({
            title: `${PostContent[i].title}`,
            desc: `${PostContent[i].description}`,
            author: `${PostContent[i].author}`,
            time: `${PostContent[i].time}`,
        });
        await item.save();
    };
};

seedPosts().then(() => {
    mongoose.connection.close();
}); 