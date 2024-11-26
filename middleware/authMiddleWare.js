function authMiddleWare(req, res, next) {
  if (!req.cookies.userId || !req.cookies.username || !req.cookies.email) {
    return res.status(403).render("AccessDenied");
  }
  next();
}

module.exports = authMiddleWare;
