const express = require("express");
const router = express.Router();


const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { newBlog , getBlog , deleteBlog , editBlog, getBlogById, getBlogByslug, getBlogByCategory } = require("../controllers/blogController");

router.route("/admin/newBlog").post(isAuthenticatedUser , newBlog);
router.route("/getBlogs").get( getBlog);
router.route("/getBlog/:id").get(getBlogById);
router.route("/getBlogBySlug/:slug").get(getBlogByslug);
router.route("/getBlogByCategory/:id").get(getBlogByCategory);
router.route("/blog/:Id").delete(isAuthenticatedUser , deleteBlog);
router.route("/editblog/:Id").post( isAuthenticatedUser ,editBlog);
module.exports = router;
