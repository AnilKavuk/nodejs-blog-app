module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(500).render("error/500", { title: "Error Page" });
  next(err);
};
