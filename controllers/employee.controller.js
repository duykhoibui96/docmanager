var Employee = require('../models/Employee');
var responseHelper = require('../helpers/response.helper');

var getIdObj = function (id) {

    return {

        EmplID: id

    }

}

module.exports = {

    get: function (req, res) {

        Employee.findOne(getIdObj(req.params.id), function (err, doc) {

            console.log(doc);
            responseHelper.sendResponse(res, doc, err);

        })

    },

    listForOptions: function (req, res) {

        var selected = req.query.selected;
        console.log(selected);
        Employee.find().select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },


    list: function (req, res) {

        var filterObj = {};

        if (req.query.EmplList) {

            var employees = req.query.EmplList;
            var array = employees === 'empty' ? [] : req.query.EmplList.split(',');
            filterObj = {

                EmplID: {
                    $in: array
                }

            }

        }


        Employee.find(filterObj, function (err, docs) {

            responseHelper.sendTableList(req, res, docs, err);

        });

    },

    create: function (req, res) {

        var newObj = new Employee(req.body);

        console.log(req.body);

        newObj.save(function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    update: function (req, res) {

        Employee.findOneAndUpdate(getIdObj(req.params.id), req.body, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    delete: function (req, res) {

        Employee.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}