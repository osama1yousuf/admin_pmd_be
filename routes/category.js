const express = require("express");
const router = express.Router();

const {
  newCategory,
  getCategory,
  deleteCategory,
  getCategoryByLevel,
  updateCategory,
} = require("../controllers/categoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route('/getCategoryBylevel/:level/:parentId').get(getCategoryByLevel)
router.route("/newCategory").post(isAuthenticatedUser , newCategory);
router.route("/categories").get(getCategory);
router.route("/movies/:genreID").delete(deleteCategory);
router.route("/updateCategory/:Id").post( isAuthenticatedUser , updateCategory);

module.exports = router;
