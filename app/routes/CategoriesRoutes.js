var express = require('express'); 

var categoryModel = require('../models/category');

var router = express.Router();

//POST: /api/category
// router.post('/', function (req , res) {
//     /*
//     #swagger.parameters['newcategory'] = {
//         in: 'body',
//         type: 'obj',
//         schema: { $ref: '#/definitions/Category' }
//     }
//     */

//     var newEntity = new categoryModel();      

//     newEntity.name = req.body.name;
    
//     newEntity.save(function(err) {
//         if (err)
//             res.send(err);
//         res.status(201).send({ msg: 'Entity created successfully.' });
//     });
// });

// GET: /api/category
router.get('/', function (req, res) {
    /* 
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/Category' }]
    }
    */
    categoryModel.find(function (err, existingEntities) {
        if (err)
            res.send(err);
        res.status(200).send(existingEntities);
    })
});

module.exports = router;