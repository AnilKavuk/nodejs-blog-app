const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const { Op } = require("sequelize");
const sequelize = require("../data/db");
const slugField = require("../helpers/slug-field");
const generateName = require("../helpers/random-generate-name");

//? admin blog route
const getBlogDelete = async (req, res) => {
  const slugs = req.params.slugs;
  const userId = req.session.userId;
  const isAdmin = req.session.roles?.includes("admin");
  try {
    const blog = await Blog.findOne({
      where: isAdmin ? { url: slugs } : { url: slugs, userId: userId },
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
      message: { text: undefined, class: undefined },
      values: {
        title: "",
        subTitle: "",
        url: "",
        description: "",
      },
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
    image: "",
    homepage: req.body.homepage == "on" ? 1 : 0,
    approval: req.body.approval == "on" ? 1 : 0,
    categoryIds: req.body.categories,
    url: req.body.url
      ? req.body.url + generateName(8)
      : req.body.title + generateName(8),
    userId: req.session.userId,
  };

  try {
    if (data.title == "") {
      throw new Error("Title cannot be left blank.");
    }
    if (data.title.length < 5 || data.title.length > 20) {
      throw new Error("title between 5 and 20 characters must contain.");
    }
    if (data.description == "") {
      throw new Error("Description cannot be left blank.");
    }
    if (req.file) {
      data.image = req.file.filename;
      fs.unlink("./public/images/" + req.file.filename, (err) => {
        console.warn(err);
      });
    }
    const blog = await Blog.create({
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      image: data.image,
      homePage: data.homepage,
      approval: data.approval,
      url: data.url,
      userId: data.userId,
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
    let msg = "";

    if (err instanceof Error) {
      msg += err.message;

      res.render("admin/blog-create", {
        title: "add blog",
        categories: await Category.findAll(),
        message: { text: msg, class: "danger" },
        values: {
          title: data.title,
          subTitle: data.subTitle,
          url: data.url,
          description: data.description,
        },
      });
    }
  }
};

const getBlogEdit = async (req, res) => {
  const slugs = req.params.slugs;
  const userId = req.session.userId;
  const isAdmin = req.session.roles?.includes("admin");
  try {
    const blog = await Blog.findOne({
      where: isAdmin
        ? { url: slugs }
        : {
            url: slugs,
            userId: userId,
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
  const userId = req.session.userId;
  const data = {
    title: req.body.title,
    subTitle: req.body.subTitle ? req.body.subTitle : null,
    description: req.body.description,
    image: req.file ? req.file.filename : req.body.imageName,
    homepage: req.body.homepage == "on" ? 1 : 0,
    approval: req.body.approval == "on" ? 1 : 0,
    categoryIds: req.body.categories,
    url: req.body.url
      ? req.body.url + generateName(8)
      : req.body.title + generateName(8),
    userId: userId,
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
        userId: userId,
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
  const userId = req.session.userId;
  const isModerator = req.session.roles?.includes("moderator");
  const isAdmin = req.session.roles?.includes("admin");
  try {
    const blogs = await Blog.findAll({
      attributes: ["id", "title", "url", "description", "subTitle", "image"],
      include: {
        model: Category,
        attributes: ["name"],
      },
      where: isModerator && !isAdmin ? { userId: userId } : null,
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
    res.render("admin/role-list", {
      title: "role list",
      roles: roles,
    });
  } catch (err) {
    console.warn(err);
  }
};

const getRolesEdit = async (req, res) => {
  const roleId = req.params.roleId;
  try {
    const role = await Role.findByPk(roleId);
    const users = await role.getUsers();

    if (role) {
      return res.render("admin/role-edit", {
        title: role.roleName,
        role: role,
        users: users,
      });
    }

    res.redirect("admin/roles");
  } catch (err) {
    console.warn(err);
  }
};

const postRolesEdit = async (req, res) => {
  const roleId = req.body.roleId;
  const roleName = req.body.roleName;
  try {
    await Role.update(
      { roleName: roleName },
      {
        where: {
          id: roleId,
        },
      }
    );
    return res.redirect("/admin/roles");
  } catch (err) {
    console.warn(err);
  }
};

const postRolesRemove = async (req, res) => {
  const roleId = req.body.roleId;
  const userId = req.body.userId;
  try {
    await sequelize.query(
      `delete  from  userRole where userId=${userId} and roleId=${roleId}`
    );
    return res.redirect("/admin/roles/" + roleId);
  } catch (err) {
    console.warn(err);
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullName", "email"],
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });
    res.render("admin/user-list", {
      title: "user list",
      users: users,
    });
  } catch (err) {
    console.warn(err);
  }
};

const getUserEdit = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: {
        model: Role,
        attributes: ["id"],
      },
    });

    const roles = await Role.findAll();

    return res.render("admin/user-edit", {
      title: "user list",
      user: user,
      roles: roles,
    });
  } catch (err) {
    console.warn(err);
  }
};

const postUserEdit = async (req, res) => {
  const userId = req.body.userId;
  const fullName = req.body.fullName;
  const email = req.body.email;
  const roleIds = req.body.roles;

  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: {
        model: Role,
        attributes: ["id"],
      },
    });

    if (user) {
      user.fullName = fullName;
      user.email = email;

      if (roleIds == undefined) {
        await user.removeRoles(user.roles);
      } else {
        await user.removeRoles(user.roles);
        const selectedRoles = await Role.findAll({
          where: {
            id: {
              [Op.in]: roleIds,
            },
          },
        });
        await user.addRoles(selectedRoles);
      }
      await user.save();
      return res.redirect("/admin/users");
    }
    return res.redirect("/admin/users");
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
  postRolesEdit,
  postRolesRemove,
  getUser,
  getUserEdit,
  postUserEdit,
};
