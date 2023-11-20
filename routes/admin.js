const express = require('express');
const { getBlogDelete, postBlogDelete, getBlogCreate, postBlogCreate, getBlogEdit, postBlogEdit, getCategoryCreate, postCategoryCreate, getCategoryEdit, getBlogList, postCategoryEdit, getCategoryDelete, postCategoryDelete, getCategoryList, getCategoryRemove } = require('../controllers/admin-controller');
const router = express.Router();

const imgUpload = require('../helpers/image-upload');


//? admin blog route
router.get("/blog/delete/:slugs", getBlogDelete);

router.post("/blog/delete/:slugs", postBlogDelete);

router.get("/blog/create", getBlogCreate);

router.post("/blog/create", imgUpload.upload.single('image'), postBlogCreate);

router.get("/blogs/:slugs", getBlogEdit);

router.post("/blogs/:slugs", imgUpload.upload.single("image"), postBlogEdit);

router.get("/blogs", getBlogList);
//? admin blog route

//? admin category route
router.get("/category/create", getCategoryCreate);

router.post("/category/create", postCategoryCreate);

router.get("/category/edit/:slugs", getCategoryEdit);

router.post("/category/edit/:slugs", postCategoryEdit);

router.get("/category/delete/:slugs", getCategoryDelete);

router.post("/category/delete/:slugs", postCategoryDelete);

router.post("/category/remove", getCategoryRemove);

router.get("/categories", getCategoryList);
//? admin category route

module.exports = router;