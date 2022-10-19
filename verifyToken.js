var jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    var bearerHeader = req.headers['authorization'];
    if (!bearerHeader)
        return res.status(403).send({auth:false, msg:'No token provided'});

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if (err)
            return res.status(401).send({auth:false, msg:'Failed to authenticate token.'});
        req.email = decoded.email;
        req.role = decoded.role;
        next();    
    });    
}

module.exports = verifyToken;
