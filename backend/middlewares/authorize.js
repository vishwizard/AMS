import ApiResponse from "../utils/ApiResponse.js";

const authorize = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json(new ApiResponse(403,{},"Access Denied"));
    }
    next();
};

export default authorize;
