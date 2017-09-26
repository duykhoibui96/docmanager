var express = require('express');
var controller = require('../../controllers/customer.controller');
var auth = require('../../helpers/authentication.helper');
var router = express.Router();

router.route('/')
    .get(controller.list)
    .post(controller.create)
    .put(controller.updateMany)

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete)

router.route('/options')
    .post(controller.listForOptions);

module.exports = router;