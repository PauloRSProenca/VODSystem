var express = require('express');
var jwt = require('jsonwebtoken');
var videoModel = require('../models/video');
const categoryModel = require('../models/category');

CreateVideo = (req, res, next) => {
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/definitions/Video1"
                }  
            }
        }
   }
   #swagger.responses[200] = {
       schema:{ $ref: '#/definitions/Video2' }
   }
    #swagger.responses[403] = {
        description: "Forbidden",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/UnAuthMsg" }
            }           
        }
    } 
   */

    hasRole(req.role, 'manager', async function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.email} have no authorization.` });
        else {
            var newEntity = new videoModel();

            const videocat = await categoryModel.findOne({ name: req.body.category }).exec();

            if (videocat === null) {
                res.status(400).send({ msg: `Category ${req.body.category} doesn't exist.` });
            }
            else {
                newEntity.title = req.body.title;
                newEntity.synopsis = req.body.synopsis;
                newEntity.director = req.body.director;
                newEntity.cast = req.body.cast;
                newEntity.category = videocat._id;
                newEntity.poster = req.body.poster;
                newEntity.streamURL = req.body.streamURL;
                newEntity.rate = [];

                newEntity.save()
                    .then(() => res.status(201).send({ msg: `Entity created successfully.` }))
                    .catch((err) => res.send(err))
            }
        }
    })
}

GetAllVideos = async (req, res, next) => {
    /* 
    #swagger.responses[200] = {
        description: "OK",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/Video4" }
            }           
        }
    } 
    */

    try {
        existingVideos = await videoModel.find().exec();
        allVideos = [];
        if (existingVideos.length != 0)
            for (let v of existingVideos)
                allVideos.push(await toDTO(v));
        res.status(200).send(allVideos);
    }
    catch (err) {
        res.send(err);
    }
}

GetVideoById = (req, res, next) => {
    /*  
    #swagger.parameters['id'] = {
       in: 'path',
       type: 'string'
    } 
    #swagger.responses[200] = {
       schema: { $ref: '#/definitions/Video3' }
    }
    #swagger.responses[403] = {
        description: "Forbidden",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/UnAuthMsg" }
            }           
        }
    } 
   */

    hasRole(req.role, 'client', async function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.email} have no authorization.` });
        else {
            try {
                theVideo = await videoModel.findById(req.params.id).exec();
                if (theVideo === null) {
                    res.status(204).send([]);
                } else {
                    res.json(await toDTO(theVideo));
                }
            }
            catch (err) {
                res.send(err);
            }
        }
    });
}

DeleteVideoById = (req, res, next) => {
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string'
    } 
    #swagger.responses[200] = {
       schema: { $ref: '#/definitions/DeleteVideo1' }
    } 
    #swagger.responses[403] = {
        description: "Forbidden",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/UnAuthMsg" }
            }           
        }
    } 
    */
    hasRole(req.role, 'manager', async function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.email} have no authorization.` });
        else {
            await videoModel.deleteOne({ _id: req.params.id })
                .then(result => {
                    if (result.deletedCount == 0) {
                        res.status(204).json({ msg: `Entity ${req.params.id} doesn't exist.` })
                    }
                    else
                        res.status(200).json({ msg: `Entity ${req.params.id} deleted successfully.` });
                })
                .catch((err) => res.send(err));
        }
    });
}

RateVideoById = (req, res, next) => {
    /* 
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string'
    }  
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/definitions/Rate"
                }  
            }
        }
    }
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/Video3' }
    }
    #swagger.responses[403] = {
        description: "Forbidden",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/UnAuthMsg" }
            }           
        }
    } 
    */
    hasRole(req.role, 'client', async function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.email} have no authorization.` });
        else {
            try {
                theVideo = await videoModel.findById(req.params.id).exec();
                if (theVideo === null)
                    res.status(204).send([]);

                theVideo.rate.push(req.body.rate);
                theVideo.save()
                    .then(async () => res.status(200).send(await toDTO(theVideo)))
                    .catch((err) => res.send(err))

            }
            catch (err) {
                res.send(err);
            }
        }
    });
}

async function toDTO(v) {
    return ({
        'id': v._id,
        'title': v.title,
        'sysnopsis': v.sysnopsis,
        'director': v.director,
        'cast': v.cast,
        'category': (await categoryModel.findById(v.category)).name,
        'poster': v.poster,
        'streamURL': v.streamURL,
        'rate': v.rate
    });
}

function hasRole(userRole, role, func) {
    func(userRole === role);
}

module.exports = {
    CreateVideo,
    GetAllVideos,
    GetVideoById,
    DeleteVideoById,
    RateVideoById,
}