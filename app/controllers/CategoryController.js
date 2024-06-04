const app = require('express');
const categoryModel = require('../models/category');

CreateCategory = (req, res, next) => {
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/definitions/Category"
                }  
            }
        }
    }  
    
    #swagger.responses[201] = {
        description: "Created",
        content: {
            "application/json": {
                schema:[ { $ref: "#/definitions/Category" } ]
            }           
        }
    } 
    */
    var newEntity = new categoryModel();

    newEntity.name = req.body.name;

    newEntity.save(function (err) {
        if (err)
            res.send(err);
        res.status(201).send({ msg: 'Entity created successfully.' });
    });
}

GetAllCategories = (req, res, next) => {
    /* 
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/Category' }]
    }
    */
    categoryModel.find(function (err, existingEntities) {
        if (err)
            res.send(err);
        allCategories = [];
        if (existingEntities.length != 0)
            for (let c of existingEntities)
                allCategories.push(
                    { 'name': c.name }
                );

        res.status(200).send(allCategories);
    });
}

module.exports = {
    CreateCategory,
    GetAllCategories
}