module.exports = function (req, res, next) {

    var token = req.headers['token'];

    if (token === undefined) {
        console.log('Unauthorized');
        res.status(401).send({

            Result: 'ERROR',
            Message: 'Unauthorized'

        });
    } else {
        req.id = Number(token);
        next();
    }

}