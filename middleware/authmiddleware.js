module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, email } = req.session.user;
  req.user = { name, email };

  next();
};
