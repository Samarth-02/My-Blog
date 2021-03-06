// Imports
var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

// Configurations
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/restful_blog_app");
// mongoose.connect("mongodb+srv://samarth:ping@blog-cluster-zxoxl.mongodb.net/test");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// it should be after bodyParser
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Database Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

// Demo entry in database

// Blog.create({
//     title: "First Post",
//     image: "https://images.unsplash.com/photo-1515504846179-94ac6b34ebb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
//     body: "Morbi nulla orci, suscipit eget lobortis sit amet, fringilla eu nisi. Sed non tincidunt lorem, at venenatis neque. Vestibulum pharetra cursus porta. Integer cursus dui a neque venenatis eleifend. Sed et nunc felis. Pellentesque et ultrices felis. In id lobortis elit. Nunc pulvinar facilisis varius. Maecenas rhoncus nisi vitae diam tincidunt, finibus ornare arcu tincidunt. Suspendisse pellentesque consectetur quam, in luctus nulla venenatis at. Fusce a arcu ornare, dapibus magna ut, bibendum mi. Integer sit amet lobortis odio, non ultricies ex. Fusce lobortis tempor odio, in aliquam lectus dictum hendrerit."
// });

// Restful Routes

// Index Route
app.get("/", function (req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// New Route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// Create Route
app.post("/blogs", function (req, res) {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show Route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
            console.log(err);
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// Edit Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

// Update Route
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Server Port
// app.listen(3000, function () {
//     console.log("Server has started!!");
// });
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
// app.listen(process.env.PORT, process.env.IP, function () {
//     console.log("Server Has Started!");
// });