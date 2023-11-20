require("dotenv").config();
const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");

const blogsDetails = async (req, res) => {
  const slug = req.params.slug;
  try {
    const blog = await Blog.findOne({
      where: {
        url: slug,
      },
      raw: true,
    });

    if (blog) {
      return res.render("users/blog-details", {
        title: blog.title,
        blog: blog,
      });
    }
    res.redirect("/");
  } catch (err) {
    console.warn(err);
  }
};

const blogList = async (req, res) => {
  const { page = 0 } = req.query;
  const slug = req.params.slug;
  try {
    const { rows, count } = await Blog.findAndCountAll({
      where: {
        approval: true,
      },
      include: slug ? { model: Category, where: { url: slug } } : null,
      raw: true,
      limit: size,
      offset: page * size,
    });
    const categories = await Category.findAll({
      raw: true,
      attributes: ["id", "name", "url"],
    });

    res.render("users/blogs", {
      title: "Tüm Kurslar",
      blogs: rows,
      totalItems: count,
      totalPages: Math.ceil(count / process.env.SIZE),
      currentPage: page,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.warn(err);
  }
};

const index = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: {
        [Op.and]: [{ homePage: true }, { approval: true }],
      },
      attributes: [
        "id",
        "title",
        "url",
        "subTitle",
        "description",
        "image",
        "homePage",
        "approval",
      ],
      raw: true,
    });
    const categories = await Category.findAll({
      raw: true,
      attributes: ["id", "name", "url"],
    });

    res.render("users/index", {
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
    });
  } catch (err) {
    console.warn(err);
  }
};

module.exports = { blogsDetails, blogList, index };
