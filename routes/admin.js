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
} = require("../controllers/admin-controller");
const router = express.Router();

const imgUpload = require("../helpers/image-upload");
const isAuth = require("../middlewares/authMiddleware");

//? admin blog route
router.get("/blog/delete/:slugs", isAuth, getBlogDelete);

router.post("/blog/delete/:slugs", isAuth, postBlogDelete);

router.get("/blog/create", isAuth, getBlogCreate);

router.post(
  "/blog/create",
  isAuth,
  imgUpload.upload.single("image"),
  postBlogCreate
);

router.get("/blogs/:slugs", isAuth, getBlogEdit);

router.post(
  "/blogs/:slugs",
  isAuth,
  imgUpload.upload.single("image"),
  postBlogEdit
);

router.get("/blogs", isAuth, getBlogList);
//? admin blog route

//? admin category route
router.get("/category/create", isAuth, getCategoryCreate);

router.post("/category/create", isAuth, postCategoryCreate);

router.get("/category/edit/:slugs", isAuth, getCategoryEdit);

router.post("/category/edit/:slugs", isAuth, postCategoryEdit);

router.get("/category/delete/:slugs", isAuth, getCategoryDelete);

router.post("/category/delete/:slugs", isAuth, postCategoryDelete);

router.post("/category/remove", isAuth, getCategoryRemove);

router.get("/categories", isAuth, getCategoryList);
//? admin category route

module.exports = router;
