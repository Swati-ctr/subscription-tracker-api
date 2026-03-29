// ===============================
// Authentication Middleware
// ===============================

const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

// protect middleware — verifies JWT token before allowing access to routes
const protect = (req, res, next) => {
    try {
        // get the authorization header from the request
        const authHeader = req.headers.authorization;

        // check if token exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        // extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // verify token using secret key — throws error if invalid or expired
        const decoded = jwt.verify(token, JWT_SECRET);

        // attach decoded user data to request object
        // now req.user is available in all protected routes
        req.user = decoded;

        // move to the next middleware or route handler
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = protect;