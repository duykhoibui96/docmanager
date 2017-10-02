var Seminar = require('../models/Seminar');
var responseHelper = require('../helpers/response.helper');

var getIdObj = function (id) {

    return {

        SeminarID: id

    }

}

module.exports = {

    get: function (req, res) {

        Seminar.findOne(getIdObj(req.params.id), function (err, doc) {

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

                    SeminarID: objAsNumber

                };


            selected = 'SeminarID Name';

        }
        Seminar.find(filterObj).select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },

    list: function (req, res) {

        Seminar.find(function (err, docs) {

            responseHelper.sendTableList(req, res, docs, err);

        });

    },

    create: function (req, res) {

        var newObj = new Seminar(req.body);

        newObj.save(function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    update: function (req, res) {

        Seminar.findOneAndUpdate(getIdObj(req.params.id), req.body, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    delete: function (req, res) {

        Seminar.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}