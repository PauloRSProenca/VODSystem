var express = require('express'); 
const verifyToken = require('../../verifyToken');

var videoModel = require('../models/video');

var router = express.Router();

//POST: /api/video)
router.post('/', verifyToken, function (req , res) {
    /*
    #swagger.parameters['newvideo'] = {
        in: 'body',
        type: 'obj',
        schema: {
            $title:"The Lord of the Rings: The Fellowship of the Ring",
            $synopsis:"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            $director:"Peter Jackson",
            $cast:["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
            $category:"6350106165ef3bb9384e0afe",
            $poster:"https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SY879_.jpg",
            $streamURL:"https://www.youtube.com/watch?v=V75dMMIW2B4",
        }
    }
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/Video' }]
    }
    */

    hasRole(req.role, 'manager', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else{
            var newEntity = new videoModel();      

            newEntity.title = req.body.title;
            newEntity.synopsis = req.body.synopsis;
            newEntity.director = req.body.director;
            newEntity.cast = req.body.cast;
            newEntity.category = req.body.category;
            newEntity.poster = req.body.poster;
            newEntity.streamURL = req.body.streamURL;
            newEntity.rate = [];
            
            newEntity.save(function(err) {      
                if (err)
                    res.send(err);
                res.status(201).send({ msg: 'Entity created successfully.' });
            });
        }
    })
});

// GET: /api/video
router.get('/', verifyToken, function (req, res) {
    /* 
    #swagger.responses[200] = {
        schema: [{ $ref: '#/definitions/Video' }]
    }
    */
    hasRole(req.role, 'client', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else{
            videoModel.find(function (err, existingVideos) {
                if (err)
                    res.send(err);
                res.status(200).send(existingVideos);
            })
        }
    });
});

// GET: /api/video/63501e2b9ef9def04fddcb4c
router.get('/:id', verifyToken, function (req, res){
    /*  
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string'
    } 
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/Video' }
    }
    */

    hasRole(req.role, 'client', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else{
            videoModel.findById(req.params.id, function(err, theVideo){
                if(err)
                    res.send(err);
                if (theVideo===null){
                    res.status(204).send([]);     
                }else{
                    res.json(theVideo);
                }
            });
        }
    });                          
});

// DELETE: api/video/63501e2b9ef9def04fddcb4c
router.delete('/:id', verifyToken, function (req, res){
    /*
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string'
    } 
    */
    hasRole(req.role, 'manager', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else{
            videoModel.remove({ _id : req.params.id}, function(err, theVideo){
                if(err)
                    res.send(err);
                res.json({ msg: `Entity ${req.params.id} deleted successfully.` });
            });
        }
    });
});

// PUT: /api/video/63501e2b9ef9def04fddcb4c/rate
router.put('/:id/rate', verifyToken, function(req, res) {
    /* 
    #swagger.parameters['id'] = {
        in: 'path',
        type: 'string'
    }  
    #swagger.parameters['Video'] = {
        in: 'body',
        type: 'obj',
        schema: {
            $rate: 3
        }
    }
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/Video' }
    }
    */
    hasRole(req.role, 'client', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else{
            videoModel.findById(req.params.id, function(err, theVideo){
                if(err)
                    res.send(err);

                if (theVideo===null)
                    res.status(204).send([]);
                    
                theVideo.rate.push(req.body.rate);

                theVideo.save(function(err) {
                    if (err)
                        res.send(err);
                    res.status(200).send(theVideo);
                })
            })
        }
    });
});

function hasRole(userRole, role, func){
    func(userRole === role);
}

module.exports = router;