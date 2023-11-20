const express = require("express");
const router = express.Router();

const {
  blogsDetails,
  blogList,
  index,
} = require("../controllers/user-controller");

// user blog route

router.use("/blogs/category/:slug", blogList);

router.use("/blogs/:slug", blogsDetails);

router.use("/blogs", blogList);

router.use("/", index);

module.exports = router;
