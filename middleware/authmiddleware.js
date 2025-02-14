module.exports = (req, res, next) => {
    if (!req.sessions.user)
        return res.status(401).json({ message: 'Unauthorized Please Login first.'});
    next();
}