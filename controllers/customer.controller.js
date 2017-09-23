var Customer = require('../models/Customer');
var responseHelper = require('../helpers/response.helper');

var getIdObj = function (id) {

    return {

        CustomerID: id

    }

}

module.exports = {

    get: function (req, res) {

        Customer.findOne(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendResponse(res, doc, err);

        })

    },

    listForOptions: function (req, res) {

        var selected = req.query.selected;
        Customer.find().select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },

    list: function (req, res) {

        var filterObj = {};

        if (req.query.EmplID) {

            filterObj = {

                ResponsibleEmpl: { $in: [req.query.EmplID] }

            }

        }

        Customer.find(filterObj,function (err, docs) {

            responseHelper.sendTableList(req, res, docs, err);

        });

    },

    create: function (req, res) {

        var newObj = new Customer(req.body);

        newObj.save(function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    update: function (req, res) {

        console.log(req.body);
        Customer.findOneAndUpdate(getIdObj(req.params.id), req.body, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    delete: function (req, res) {

        Customer.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}