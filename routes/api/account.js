var express = require('express');
var controller = require('../../controllers/account.controller');
var auth = require('../../helpers/authentication.helper');
var router = express.Router();

router.use(auth);
router.post('/authentication',controller.authenticate);
router.put('/',controller.update);

module.exports = router;