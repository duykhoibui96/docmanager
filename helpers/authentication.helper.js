var jwt = require('jsonwebtoken');
var config = require('../config/secret.json');
module.exports = function (req, res, next) {

    var token = req.headers['token'];

    var path = req.originalUrl;

    if (path.includes('options') || path.includes('authentication') || path.includes('files'))
        next();
    else if (!token)
        res.status(401).send({

            Result: 'ERROR',
            Message: 'Unauthorized'

        });
    else
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                console.log('Forbidden');
                res.status(403).send({

                    Result: 'ERROR',
                    Message: 'Forbidden'

                });
            } else {
                req.id = Number(decoded.EmplID);
                req.permissions = decoded.permissions;
                next();
            }
        });


}