var account = require('../models/Account');

module.exports = {

    authenticate: function (req, res) {

        var data = req.body;

        account.findOne(data).select('EmplID Username').exec(function (err, doc) {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                if (doc == null)
                    res.status(406).send('Invalid username or password');
                else
                    res.send(doc);
            }

        })

    },

    update: function (req, res) {

        var data = req.body;
        console.log(data);

        account.findOneAndUpdate({
            EmplID: req.id
        }, data , {
            new: true
        }, function (err, doc) {

            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                if (doc == null)
                    res.status(404).send('User not found!');
                else
                    res.send(doc);
            }


        })

    }

}