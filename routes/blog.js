const express = require("express");
const router = express.Router();


const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { newBlog , getBlog , deleteBlog , editBlog, getBlogById, getBlogByslug, getBlogByCategory } = require("../controllers/blogController");

// router.route("/admin/newBlog").post(isAuthenticatedUser , newBlog);
// router.route("/getBlogs").get( getBlog);
// router.route("/getBlog/:id").get(getBlogById);
// router.route("/getBlogBySlug/:slug").get(getBlogByslug);
// router.route("/getBlogByCategory/:id").get(getBlogByCategory);
// router.route("/blog/:Id").delete(isAuthenticatedUser , deleteBlog);
// router.route("/editblog/:Id").post( isAuthenticatedUser ,editBlog);

// Blog routes
router.post('/admin/newBlog', isAuthenticatedUser, newBlog);
router.get('/getBlogs', getBlog);
router.get('/getBlog/:id', getBlogById);
router.get('/getBlogBySlug/:slug', getBlogByslug);
router.get('/getBlogByCategory/:id', getBlogByCategory);
router.delete('/blog/:id', isAuthenticatedUser, deleteBlog);
router.post('/editblog/:id', editBlog);

module.exports = router;
