var jwt = require('jsonwebtoken');
var config = require('./config.helper');
module.exports = function (req, res, next) {

    var token = req.headers['token'];

    var path = req.originalUrl;

    if (path.includes('options') || path.includes('authentication') || path.includes('files'))
        next();
    else
        jwt.verify(token, config.secretkey, function (err, decoded) {
            if (err) {
                console.log('Unauthorized');
                res.status(401).send({

                    Result: 'ERROR',
                    Message: 'Unauthorized'

                });
            } else {
                req.id = Number(decoded.EmplID);
                req.permissions = decoded.permissions;
                next();
            }
        });


}