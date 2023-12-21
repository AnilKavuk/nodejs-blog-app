const express = require("express");
const {
  getBlogDelete,
  postBlogDelete,
  getBlogCreate,
  postBlogCreate,
  getBlogEdit,
  postBlogEdit,
  getCategoryCreate,
  postCategoryCreate,
  getCategoryEdit,
  getBlogList,
  postCategoryEdit,
  getCategoryDelete,
  postCategoryDelete,
  getCategoryList,
  getCategoryRemove,
  getRoles,
  getRolesEdit,
  postRolesEdit,
  postRolesRemove,
  getUser,
  getUserEdit,
  postUserEdit,
} = require("../controllers/admin-controller");
const router = express.Router();

const imgUpload = require("../helpers/image-upload");
const csrf = require("../middlewares/csrf-middleware");
const isAdmin = require("../middlewares/isAdmin");
const isModerator = require("../middlewares/isModerator");

//? admin blog route
router.get("/blog/delete/:slugs", isModerator, csrf, getBlogDelete);

router.post("/blog/delete/:slugs", isModerator, postBlogDelete);

router.get("/blog/create", isModerator, csrf, getBlogCreate);

router.post(
  "/blog/create",
  isModerator,
  csrf,
  imgUpload.upload.single("image"),
  postBlogCreate
);

router.get("/blogs/:slugs", isModerator, csrf, getBlogEdit);

router.post(
  "/blogs/:slugs",
  isModerator,
  imgUpload.upload.single("image"),
  postBlogEdit
);

router.get("/blogs", isModerator, csrf, getBlogList);
//? admin blog route

//? admin category route
router.get("/category/create", isAdmin, csrf, getCategoryCreate);

router.post("/category/create", isAdmin, postCategoryCreate);

router.get("/category/edit/:slugs", isAdmin, csrf, getCategoryEdit);

router.post("/category/edit/:slugs", isAdmin, postCategoryEdit);

router.get("/category/delete/:slugs", isAdmin, csrf, getCategoryDelete);

router.post("/category/delete/:slugs", isAdmin, postCategoryDelete);

router.post("/category/remove", isAdmin, getCategoryRemove);

router.get("/categories", isAdmin, getCategoryList);
//? admin category route

//? admin role route
router.get("/roles", isAdmin, getRoles);

router.get("/roles/:roleId", isAdmin, csrf, getRolesEdit);

router.post("/roles/remove", isAdmin, postRolesRemove);

router.post("/roles/:roleId", isAdmin, postRolesEdit);

router.get("/users", isAdmin, getUser);

router.get("/users/edit/:userId", isAdmin, csrf, getUserEdit);

router.post("/users/edit/:userId", isAdmin, postUserEdit);
//? admin role route

module.exports = router;
