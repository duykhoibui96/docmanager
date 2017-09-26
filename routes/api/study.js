var express = require('express');
var multer = require('multer');
var controller = require('../../controllers/study.controller');
var auth = require('../../helpers/authentication.helper');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('destination');
        cb(null, './data');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var filenames = filename.split('.');
        filenames[0] = filenames[0] + '-' + Date.now();
        filename = filenames.join('.');
        cb(null, filename);
    }
});

var upload = multer({
    storage: storage
}).array('uplfiles');

router.route('/files/:id')
    .post(function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
                res.end('Error');
            } else {
                controller.saveFiles(req, res);
            }
        })

    })
    .put(controller.deleteFile);

router.route('/')
    .get(controller.list)
    .post(controller.create)

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete)

router.route('/options')
    .post(controller.listForOptions);

module.exports = router;