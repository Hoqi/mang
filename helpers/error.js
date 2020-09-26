class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.status = statusCode;
        this.message = message;
    }
}

const handleError = function (error, res) {
    try {
        const { status, message } = error;
        res.status(status).json({
            message
        })
    } catch (err) {
        res.status(500).send('HA-HA')
    }
}

module.exports = {
    ErrorHandler,
    handleError
};