var express = require('express');
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

    hasRole(req.role, 'manager', function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else {
            var newEntity = new videoModel();

            const videocat = categoryModel.findOne({ name: req.body.category });

            newEntity.title = req.body.title;
            newEntity.synopsis = req.body.synopsis;
            newEntity.director = req.body.director;
            newEntity.cast = req.body.cast;
            newEntity.category = videocat._id;
            newEntity.poster = req.body.poster;
            newEntity.streamURL = req.body.streamURL;
            newEntity.rate = [];

            newEntity.save(function (err) {
                if (err)
                    res.send(err);
                res.status(201).send({ msg: 'Entity created successfully.' });
            });
        }
    })
}

GetAllVideos = (req, res, next) => {
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
    videoModel.find(async function (err, existingVideos) {
        if (err)
            res.send(err);

        allVideos = [];
        if (existingVideos.length != 0)
            for (let v of existingVideos)
                allVideos.push(await toDTO(v));
        res.status(200).send(allVideos);
    })
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

    hasRole(req.role, 'client', function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else {
            videoModel.findById(req.params.id, async function (err, theVideo) {
                if (err)
                    res.send(err);
                if (theVideo === null) {
                    res.status(204).send([]);
                } else {
                    res.json(await toDTO(theVideo));
                }
            });
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
    hasRole(req.role, 'manager', function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else {
            videoModel.remove({ _id: req.params.id }, function (err, theVideo) {
                if (err)
                    res.send(err);
                res.json({ msg: `Entity ${req.params.id} deleted successfully.` });
            });
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
    hasRole(req.role, 'client', function (decision) {
        if (!decision)
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else {
            videoModel.findById(req.params.id, function (err, theVideo) {
                if (err)
                    res.send(err);

                if (theVideo === null)
                    res.status(204).send([]);

                theVideo.rate.push(req.body.rate);

                theVideo.save(async function (err) {
                    if (err)
                        res.send(err);
                    res.status(200).send(await toDTO(theVideo));
                })
            })
        }
    });
}

async function toDTO(v) {
    return ({
        'id': v.id,
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