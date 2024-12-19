const authorize = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user.role;
    if (!userRole.some(role => allowedRoles.includes(role))) {
        return res.status(403).json({ message: 'Access Denied' });
    }
    next();
};

export default authorize;
