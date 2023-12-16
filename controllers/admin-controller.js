const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slug-field");

//? admin blog route
const getBlogDelete = async (req, res) => {
  const slugs = req.params.slugs;

  try {
    const blog = await Blog.findOne({
      where: { url: slugs },
    });

    if (blog) {
      return res.render("admin/blog-delete", {
        title: "delete blog",
        blog: blog,
      });
    }

    res.redirect("/admin/blogs");
  } catch (err) {
    console.warn(err);
  }
};

const postBlogDelete = async (req, res) => {
  const slugs = req.body.blogUrl;

  try {
    const blog = await Blog.findOne({
      where: { url: slugs },
    });

    if (blog) {
      await blog.destroy();
      return res.redirect("/admin/blogs?action=delete");
    }

    res.redirect("/admin/blogs");
  } catch (err) {
    console.warn(err);
  }
};

const getBlogCreate = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render("admin/blog-create", {
      title: "add blog",
      categories: categories,
    });
  } catch (err) {
    console.warn(err);
  }
};

const postBlogCreate = async (req, res) => {
  const data = {
    title: req.body.title,
    subTitle: req.body.subTitle ? req.body.subTitle : null,
    description: req.body.description,
    image: req.file.filename,
    homepage: req.body.homepage == "on" ? 1 : 0,
    approval: req.body.approval == "on" ? 1 : 0,
    categoryIds: req.body.categories,
    url: req.body.url ? req.body.url : req.body.title,
  };

  try {
    const blog = await Blog.create({
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      image: data.image,
      homePage: data.homepage,
      approval: data.approval,
      url: data.url,
    });

    if (data.categoryIds == undefined) {
      await blog.removeCategories(blog.categories);
    } else {
      await blog.removeCategories(blog.categories);
      const selectedCategories = await Category.findAll({
        where: {
          id: {
            [Op.in]: data.categoryIds,
          },
        },
      });
      await blog.addCategories(selectedCategories);
    }
    res.redirect("/admin/blogs?action=create");
  } catch (err) {
    console.warn(err);
  }
};

const getBlogEdit = async (req, res) => {
  const slugs = req.params.slugs;
  try {
    const blog = await Blog.findOne({
      where: {
        url: slugs,
      },
      include: {
        model: Category,
        attributes: ["id"],
      },
    });
    const categories = await Category.findAll();
    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.dataValues.title,
        blog: blog.dataValues,
        categories: categories,
      });
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.warn(err);
  }
};

const postBlogEdit = async (req, res) => {
  const blogId = req.body.blogId;
  const data = {
    title: req.body.title,
    subTitle: req.body.subTitle ? req.body.subTitle : null,
    description: req.body.description,
    image: req.file ? req.file.filename : req.body.imageName,
    homepage: req.body.homepage == "on" ? 1 : 0,
    approval: req.body.approval == "on" ? 1 : 0,
    categoryIds: req.body.categories,
    url: req.body.url ? req.body.url : req.body.title,
  };

  if (req.file) {
    await fs.unlink("./public/images/" + req.body.imageName, (err) => {
      console.log(err);
    });
  }

  try {
    const blog = await Blog.findOne({
      where: {
        id: blogId,
      },
      include: {
        model: Category,
        attributes: ["id"],
      },
    });

    if (blog) {
      blog.title = data.title;
      blog.subTitle = data.subTitle;
      blog.description = data.description;
      blog.image = data.image;
      blog.homePage = data.homepage;
      blog.approval = data.approval;
      blog.url = slugField(data.url);
      if (data.categoryIds == undefined) {
        await blog.removeCategories(blog.categories);
      } else {
        await blog.removeCategories(blog.categories);
        const selectedCategories = await Category.findAll({
          where: {
            id: {
              [Op.in]: data.categoryIds,
            },
          },
        });
        await blog.addCategories(selectedCategories);
      }

      await blog.save();
      return res.redirect(
        "/admin/blogs?action=edit&slugs=" + slugField(data.url)
      );
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.warn(err);
  }
};

const getBlogList = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: ["id", "title", "url", "description", "subTitle", "image"],
      include: {
        model: Category,
        attributes: ["name"],
      },
    });

    res.render("admin/blog-list", {
      title: "blog list",
      blogs: blogs,
      action: req.query.action,
      slugs: req.query.slugs,
    });
  } catch (err) {
    console.warn(err);
  }
};
//? admin blog route

//? admin category route
const getCategoryCreate = async (req, res) => {
  try {
    res.render("admin/category-create", {
      title: "category add",
    });
  } catch (err) {
    console.warn(err);
  }
};

const postCategoryCreate = async (req, res) => {
  data = req.body.name;
  try {
    await Category.create({ name: data, url: slugField(data) });
    res.redirect("/admin/categories?action=category-create");
  } catch (err) {
    console.warn(err);
  }
};

const getCategoryEdit = async (req, res) => {
  try {
    const categoryUrl = req.params.slugs;
    const category = await Category.findOne({
      where: { url: categoryUrl },
    });
    const blogs = await category.getBlogs();
    const countBlog = await category.countBlogs();

    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues,
        blogs: blogs,
        countBlog: countBlog,
      });
    }
    res.redirect("/admin/categories");
  } catch (err) {
    console.warn(err);
  }
};

const postCategoryEdit = async (req, res) => {
  categoryUrl = req.body.categoryUrl;
  data = req.body.name;
  try {
    await Category.update(
      { name: data, url: slugField(data) },
      {
        where: {
          url: categoryUrl,
        },
      }
    );
    return res.redirect(
      "/admin/categories?action=category-edit&slugs=" + categoryUrl
    );
  } catch (err) {
    console.warn(err);
  }
};

const getCategoryDelete = async (req, res) => {
  const categoryUrl = req.params.slugs;

  try {
    const category = await Category.findOne({
      where: { url: categoryUrl },
    });

    res.render("admin/category-delete", {
      title: "delete category",
      category: category,
    });
  } catch (err) {
    console.warn(err);
  }
};

const postCategoryDelete = async (req, res) => {
  const categoryUrl = req.body.categoryUrl;

  try {
    await Category.destroy({
      where: {
        url: categoryUrl,
      },
    });

    res.redirect("/admin/categories?action=category-delete");
  } catch (err) {
    console.warn(err);
  }
};

const getCategoryRemove = async (req, res) => {
  const blogId = req.body.blogId;
  const categoryId = req.body.categoryId;
  const categoryUrl = req.body.categoryUrl;

  await sequelize.query(
    `delete from blogCategories where blogId=${blogId} and categoryId=${categoryId}`
  );

  res.redirect("/admin/category/edit/" + categoryUrl);
};

const getCategoryList = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.render("admin/category-list", {
      title: "category list",
      categories: categories,
      action: req.query.action,
      blogId: req.query.blogId,
    });
  } catch (err) {
    console.warn(err);
  }
};
//? admin category route

//? admin role route
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: {
        include: [
          "role.id",
          "role.roleName",
          [sequelize.fn("COUNT", sequelize.col("users.id")), "user_count"],
        ],
      },
      include: [{ model: User, attributes: ["id"] }],
      group: ["role.id"],
      raw: true,
      includeIgnoreAttributes: false,
    });
    console.log("roles: ", roles);
    res.render("admin/role-list", {
      title: "role list",
      roles: roles,
    });
  } catch (err) {
    console.warn(err);
  }
};

const getRolesEdit = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: {
        include: [
          "role.id",
          "role.roleName",
          "role.url",
          [(sequelize.fn("COUNT", sequelize.col("users.id")), "user_count")],
        ],
      },
      include: [{ model: User, attributes: ["id"] }],
      group: ["role.id"],
      raw: true,
      includeIgnoreAttributes: false,
    });
    console.log("roles: ", roles);
    res.render("admin/role-list", {
      title: "role list",
      roles: roles,
    });
  } catch (err) {
    console.warn(err);
  }
};
//? admin role route
module.exports = {
  getBlogDelete,
  postBlogDelete,
  getBlogCreate,
  postBlogCreate,
  getBlogEdit,
  postBlogEdit,
  getBlogList,
  getCategoryCreate,
  postCategoryCreate,
  getCategoryEdit,
  postCategoryEdit,
  getCategoryDelete,
  postCategoryDelete,
  getCategoryList,
  getCategoryRemove,
  getRoles,
  getRolesEdit,
};
