// ===============================
// Global Error Handler Middleware
// ===============================

const errorHandler = (err, req, res, next) => {

    // if status code is still 200 (default), change it to 500 (server error)
    // otherwise keep the existing status code (404, 401 etc.)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // always return a clean JSON error response
    res.status(statusCode).json({
        message: err.message
    });

};

module.exports = errorHandler;