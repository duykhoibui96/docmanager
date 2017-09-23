var express = require('express');
var controller = require('../../controllers/account.controller');
var auth = require('../../helpers/authentication.helper');
var router = express.Router();

router.post('/authentication',controller.authenticate);
router.put('/',auth,controller.update);

module.exports = router;