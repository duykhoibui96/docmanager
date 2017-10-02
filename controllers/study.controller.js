var Study = require('../models/Study');
var responseHelper = require('../helpers/response.helper');
var fs = require('fs');

var getIdObj = function (id) {

    return {

        StudyID: id

    }

}

module.exports = {

    saveFiles: function (req, res) {

        var files = req.files;
        console.log(files);
        var StudyID = req.params.id;
        for (var i = 0; i < files.length; i++)
            files[i].time = Date.now();

        Study.findOneAndUpdate({
            StudyID: StudyID
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
        Study.findOneAndUpdate({
            StudyID: req.params.id
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

        Study.findOne(getIdObj(req.params.id), function (err, doc) {

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

                    StudyID: objAsNumber

                };


            selected = 'StudyID Name';

        }
        Study.find(filterObj).select(selected).exec(function (err, docs) {

            responseHelper.sendTableOptions(res, docs, err);

        })

    },


    list: function (req, res) {

        var filterObj = {};

        if (req.query.StudyEmpl) {

            var employees = req.query.StudyEmpl;
            var array = employees === 'empty' ? [] : req.query.StudyEmpl.split(',');
            filterObj = {

                StudyEmpl: {
                    $in: array
                }

            }
            console.log(filterObj);

        } else if (req.query.Instructor) {

            var employees = req.query.Instructor;
            var array = employees === 'empty' ? [] : req.query.Instructor.split(',');
            filterObj = {

                Instructor: {
                    $in: array
                }

            }

        }
        Study.find(filterObj, function (err, docs) {

            responseHelper.sendTableList(req, res, docs, err);

        });

    },

    create: function (req, res) {

        var newObj = new Study(req.body);

        newObj.save(function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    update: function (req, res) {

        Study.findOneAndUpdate(getIdObj(req.params.id), req.body, {
            new: true
        }, function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    },

    updateMany: function (req, res) {

        var studyList = req.body.studyList;
        var updateObj = req.body.StudyEmpl ? {

            $push: {
                StudyEmpl: req.body.StudyEmpl
            }

        } : {

            $push: {
                Instructor: req.body.Instructor
            }


        }

        Study.update({

            StudyID: {
                $in: studyList
            }

        }, updateObj , function (err) {

            responseHelper.sendResponse(res,'OK',err);

        })


    },

    delete: function (req, res) {

        Study.findOneAndRemove(getIdObj(req.params.id), function (err, doc) {

            responseHelper.sendTableDetails(res, doc, err);

        })

    }


}