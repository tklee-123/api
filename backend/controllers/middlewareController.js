const jwt = require("jsonwebtoken");
const User = require("../models/User");

const middlewareController = {
    // Verify token
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.token;

            if (token) {
                const accessToken = token.split(" ")[1];
                const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                const user = await User.findById(decoded.id);

                if (!user) {
                    return res.status(403).json("Token is not valid");
                }

                // Kiểm tra xem người dùng có phải là chính mình hoặc là admin không
                if (user._id.toString() === req.params.id || user.role === "admin") {
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json("You're not allowed to perform this action");
                }
            } else {
                return res.status(401).json("You're not authenticated");
            }
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    },

    // Verify token and admin role
    verifyTokenAndAdmin: async (req, res, next) => {
        try {
            await middlewareController.verifyToken(req, res, async () => {
                if (req.user.role === "admin") {
                    next();
                } else {
                    return res.status(403).json("You're not allowed to perform this action");
                }
            });
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    },
};

module.exports = middlewareController;
