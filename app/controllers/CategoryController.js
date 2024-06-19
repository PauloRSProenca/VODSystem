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

    newEntity.save()
        .then( () => res.status(201).send({ msg: 'Entity created successfully.' }))
        .catch( (err) => res.send(err))

}

GetAllCategories = async (req, res, next) => {
    /* 
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/Category' }]
    }
    */
    try {
        existingEntities = await categoryModel.find().exec();
        allCategories = [];
        if (existingEntities.length != 0)
            for (let c of existingEntities)
                allCategories.push({ 'name': c.name });
        res.status(200).send(allCategories);
    }
    catch (error) {
        res.send(error)
    }
}

module.exports = {
    CreateCategory,
    GetAllCategories
}