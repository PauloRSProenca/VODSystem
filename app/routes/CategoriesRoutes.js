var express = require('express');
var { celebrate, Joi } = require('celebrate');

var categoryController = require('../controllers/CategoryController');

var router = express.Router();

//POST: /api/category
router.post('/',
    celebrate({
        body: Joi.object({
            name: Joi.string().required()
        })
    }),
    categoryController.CreateCategory
);


// GET: /api/category
router.get('/',
    categoryController.GetAllCategories
);

module.exports = router;