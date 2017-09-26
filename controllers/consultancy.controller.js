var Consultancy = require('../models/Consultancy');
var responseHelper = require('../helpers/response.helper');

var getIdObj = function (id) {

    return {

        ConsID: id

    }

}

module.exports = {

    saveFiles: function (req, res) {

        var files = req.files;
        var ConsID = req.params.id;
        for (var i = 0; i < files.length; i++)
            files[i].time = Date.now();

        Consultancy.findOneAndUpdate({
            ConsID: ConsID
        }, {
            $pushAll: {
                Document: req.files
            }
        }, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    deleteFile: function (req, res) {

        console.log(req.body);
        var path = req.body.path;
        Consultancy.findOneAndUpdate({
            ConsID: req.params.id
        }, {
            $pop: {
                Document: req.body
            }
        }, {
            new: true
        }, function (err, doc) {

            if (doc)
                fs.unlink(path, function (err) {

                    console.log(err);

                });
            responseHelper.sendTableDetails(res, doc, err);

        })


    },

    get: function (req, res) {

        Consultancy.findOne(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendResponse(res, doc, err);

        })

    },

    listForOptions: function (req, res) {

        var selected = req.query.selected;
        Consultancy.find().select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },


    list: function (req, res) {

        var filterObj = {};

        if (req.query.ConsultingEmplID)
            filterObj = {

                ConsultingEmplID: req.query.ConsultingEmplID

            }

        else if (req.query.ConsultedEmplID)
            filterObj = {

                ConsultedEmplID: req.query.ConsultedEmplID

            }

        else if (req.query.CustomerID)
            filterObj = {

                CustomerID: req.query.CustomerID

            }
        else if (req.query.onlyCustomer) {
            console.log('Got here');
            Consultancy.find().select('CustomerID').exec(function (err, docs) {

                console.log(docs);
                responseHelper.sendResponse(res, docs, err);


            });
            return;
        }

        Consultancy.find(filterObj, function (err, docs) {

            responseHelper.sendTableList(req, res, docs, err);

        });

    },

    create: function (req, res) {

        var newObj = new Consultancy(req.body);

        newObj.save(function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    update: function (req, res) {

        Consultancy.findOneAndUpdate(getIdObj(req.params.id), req.body, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    delete: function (req, res) {

        Consultancy.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}