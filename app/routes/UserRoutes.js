var express = require('express');
var { celebrate, Joi, errors, Segments } = require('celebrate');

var userController = require('../controllers/UserController');

var VerifyToken = require('../../verifyToken');

require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/signup',
    celebrate({
        body: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }),
    userController.SignUp
);

router.post('/signin',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    userController.SignIn
);

// GET: /api/user
router.get('/', VerifyToken,
    userController.GetAllUsers
);


// celebrate error handler
router.use(errors());

module.exports = router;