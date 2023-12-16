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
} = require("../controllers/admin-controller");
const router = express.Router();

const imgUpload = require("../helpers/image-upload");
const isAuth = require("../middlewares/auth-middleware");
const csrf = require("../middlewares/csrf-middleware");

//? admin blog route
router.get("/blog/delete/:slugs", isAuth, csrf, getBlogDelete);

router.post("/blog/delete/:slugs", isAuth, postBlogDelete);

router.get("/blog/create", isAuth, csrf, getBlogCreate);

router.post(
  "/blog/create",
  isAuth,
  imgUpload.upload.single("image"),
  postBlogCreate
);

router.get("/blogs/:slugs", isAuth, csrf, getBlogEdit);

router.post(
  "/blogs/:slugs",
  isAuth,
  imgUpload.upload.single("image"),
  postBlogEdit
);

router.get("/blogs", isAuth, csrf, getBlogList);
//? admin blog route

//? admin category route
router.get("/category/create", isAuth, csrf, getCategoryCreate);

router.post("/category/create", isAuth, postCategoryCreate);

router.get("/category/edit/:slugs", isAuth, csrf, getCategoryEdit);

router.post("/category/edit/:slugs", isAuth, postCategoryEdit);

router.get("/category/delete/:slugs", isAuth, csrf, getCategoryDelete);

router.post("/category/delete/:slugs", isAuth, postCategoryDelete);

router.post("/category/remove", isAuth, getCategoryRemove);

router.get("/categories", isAuth, getCategoryList);
//? admin category route

//? admin role route
router.get("/roles", isAuth, getRoles);

// router.get("/roles/:slugs", isAuth, csrf, getRolesEdit);
// router.post("/roles/remove", isAuth, postRolesRemove);
//? admin role route

module.exports = router;
