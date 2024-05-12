const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const path = require('path')
const UserkaModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const upload = require('./config/multerconfig');

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await UserkaModel.findOne({ email: req.user.email }).populate("posts")
    // console.log(user);
    // console.log(req.user);
    res.render('profile', { user })
})

app.post('/register', async (req, res) => {
    let { email, password, name, age, username } = req.body
    let user = await UserkaModel.findOne({ email });
    if (user) {
        res.status(500).send("User already registered")
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await UserkaModel.create({
                    email,
                    password: hash,
                    name,
                    age,
                    username
                });

                let token = jwt.sign({ email: email, userid: user._id }, "shhh");
                res.cookie("token", token);
                res.status(200).redirect("/profile")
            })
        })
    }
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await UserkaModel.findOne({ email })
    if (!user) res.status(500).send("Something Went Worng");
    else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: email, userid: user._id }, "shhh");
                res.cookie("token", token);
                res.status(200).redirect("/profile");
            }
            else {
                res.status(500).send("Something Went Wrong")
            }
        })
    }

})

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.status(302).redirect("login");
})

app.post('/createpost', isLoggedIn, async (req, res) => {
    let user = await UserkaModel.findOne({ email: req.user.email })
    let { content } = req.body;
    let post = await postModel.create({
        user: user._id,
        content,
    });

    user.posts.push(post._id);
    await user.save();
    res.status(200).redirect("/profile");
})

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user")

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.status(200).redirect("/profile");
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user")

    res.render("edit", { post });
})

app.post('/update/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content })
    res.status(200).redirect("/profile");
})

app.get('/profile/upload', isLoggedIn, (req, res) => {
    res.render('profileupload')
})

app.post('/upload', upload.single("image"), isLoggedIn, async (req, res) => {
    let user = await UserkaModel.findOne({ email: req.user.email });
    user.profilepic = req.file.filename;
    await user.save();
    res.status(200).redirect("/profile");
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") res.redirect("/login");
    else {
        let data = jwt.verify(req.cookies.token, "shhh");
        req.user = data;
        next()
    }
}
app.listen(3000);