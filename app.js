const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Post = require('./models/post');
const { PostSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://127.0.0.1:27017/finance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");

});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname , 'public')));
app.use(methodOverride('_method'));


const validatePost = (req, res, next) => {
    const { error } = PostSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/posts', catchAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
}));

app.get('/posts/new', (req, res) => {
    res.render('posts/new');
});

app.post('/posts', validatePost, catchAsync(async (req, res, next) => {
    const post = new Post(req.body.post);
    await post.save(); 
    res.redirect(`/posts`);
}));

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
});