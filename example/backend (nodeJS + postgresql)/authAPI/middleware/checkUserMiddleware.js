const ApiError = require('../AuthAPIError')

module.exports = function (req, res, next) {
    try {

        //TODO checking password before changing data

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}