var account = require('../models/Account');
var Permission = require('../models/Permission');
var config = require('../helpers/config.helper');
var jwt = require('jsonwebtoken');

module.exports = {

    authenticate: function (req, res) {

        var data = req.body;

        account.findOne(data).select('EmplID Username').exec(function (err, doc) {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                if (doc == null)
                    res.status(406).send('Tài khoản hoặc mật khẩu bị sai');
                else {

                    var retObj = {
                        
                        Username: doc.Username,
                        EmplID: doc.EmplID
                        
                    };

                    Permission.find({
                        EmplIDList: {
                            $in: [doc.EmplID]
                        }
                    }).select('Name').exec(function (err, docs) {

                        retObj.permissions = docs.map(function(item){

                            return item.Name;

                        })

                        retObj.token = jwt.sign({

                            EmplID: retObj.EmplID,
                            permissions: retObj.permissions

                        }, config.secretkey);
                        
                        res.send(retObj);

                    })


                }

            }

        })

    },

    update: function (req, res) {

        var data = req.body;
        console.log(data);

        account.findOneAndUpdate({
            EmplID: req.id
        }, data, {
            new: true
        }, function (err, doc) {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                if (doc == null)
                    res.status(404).send('Người dùng không tồn tại');
                else
                    res.send(doc);
            }


        })

    }

}