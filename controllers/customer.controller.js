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
        var filterObj = {};
        if (req.query.search) {

            var search = req.query.search;
            var objAsNumber = Number(search);
            console.log(objAsNumber);
            if (isNaN(objAsNumber))
                filterObj = {

                    Name: { "$regex": search, "$options": "i" }

                };
            else
                filterObj = {

                    CustomerID: objAsNumber

                };


            selected = 'CustomerID Name';

        }
        Customer.find(filterObj).select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },

    list: function (req, res) {

        var filterObj = {};

        if (req.query.EmplID) {

            filterObj = {

                ResponsibleEmpl: {
                    $in: [req.query.EmplID]
                }

            }

        } else if (req.query.list) {

            var list = req.query.list === 'empty' ? [] : req.query.list.split(',').map(item => Number(item));
            console.log(list); 
            filterObj = {

                CustomerID: {
                    $in: list
                }

            }

        } else if (req.query.exceptedList) {

            var list = req.query.exceptedList === 'empty' ? [] : req.query.exceptedList.split(',').map(item => Number(item)); 
            filterObj = {

                CustomerID: {
                    $nin: list
                }

            }

        }

        Customer.find(filterObj, function (err, docs) {

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

    updateMany: function (req, res) {

        var customerList = req.body.customerList;
        var id = req.body.EmplID;

        Customer.update({

            CustomerID: {
                $in: customerList
            }

        }, {
            $push: {
                ResponsibleEmpl: id
            }
        }, function (err) {

            responseHelper.sendResponse(res,'OK',err);

        })


    },

    delete: function (req, res) {

        Customer.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}