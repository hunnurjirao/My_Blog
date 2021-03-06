const express = require('express')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
app.use(fileUpload())
const expressSession = require('express-session');
const flash = require('connect-flash');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')

const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const validateMiddleware = require("./middleware/validateMiddleware");
const newUserController = require("./controllers/newUser");
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

const uri = "mongodb+srv://hunnurjirao:rajahunnur666@cluster0.ubnum.mongodb.net/blog_database"
mongoose.connect(uri || "mongodb://localhost/blog_database", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash());
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.use('/posts/store', validateMiddleware)


app.use(expressSession({
    secret: 'K HUNNURJI RAO',
    saveUninitialized: true,
    resave: true
}))

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})


app.get('/', homeController)
app.get('/post/:id', getPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/posts/new', authMiddleware, newPostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)
app.use((req, res) => res.render('notfound'));


