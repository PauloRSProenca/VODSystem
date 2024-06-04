var express = require('express');
const verifyToken = require('../../verifyToken');
var { celebrate, Joi, errors, Segments } = require('celebrate');

var videoController = require('../controllers/VideoController');

var router = express.Router();

//POST: /api/video
router.post('/',
    celebrate({
        body: Joi.object({
            title: Joi.string().required(),
            synopsis: Joi.string().required(),
            director: Joi.string().required(),
            cast: Joi.array().items(Joi.string()).required(),
            category: Joi.string().required(),
            poster: Joi.string().uri().required(),
            streamURL: Joi.string().uri().required()
        })
    }),
    videoController.CreateVideo
);

// GET: /api/video
router.get('/',
    videoController.GetAllVideos
);

// GET: /api/video/63501e2b9ef9def04fddcb4c
router.get('/:id', verifyToken,
    videoController.GetVideoById
);

// DELETE: api/video/63501e2b9ef9def04fddcb4c
router.delete('/:id', verifyToken,
    videoController.DeleteVideoById
);

// PUT: /api/video/63501e2b9ef9def04fddcb4c/rate
router.put('/:id/rate', verifyToken,
    celebrate({
        body: Joi.object({
            rate: Joi.number().integer().min(1).max(5).required()
        })
    }),
    videoController.RateVideoById
);

module.exports = router;