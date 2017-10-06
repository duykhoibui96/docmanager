var express = require('express');
var controller = require('../../controllers/seminar.controller');
var auth = require('../../helpers/authentication.helper');
var router = express.Router();

router.use(auth);

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