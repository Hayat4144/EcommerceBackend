module.exports = (AsycnFuncError) => (req, res, next) => {
    Promise.resolve(AsycnFuncError(req, res, next)).catch(next)
}