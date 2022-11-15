var express = require('express'); 

var UserModel = require('../models/user');
var VerifyToken = require('../../verifyToken');

require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/signup', function (req , res) {
    /*
    #swagger.parameters['newuser'] = {
        in: 'body',
        type: 'obj',
        schema: { 
            $name: 'Alice'  ,          
            $email: 'user@fake-mail.com',
            $password: 'password1',
        }
    }
    #swagger.responses[200] = {
        "msg": "User user@fake-mail.com successfully signedup."
    }
    */

    var newuser = new UserModel();      

    newuser.name = req.body.name;
    newuser.email = req.body.email;
    newuser.role = 'client';
    newuser.password = req.body.password;
   
    newuser.save(function(err) {
        if (err){        
            res.status(400).send(err);
        }
        else{
            res.status(201).send({ msg: `User ${req.body.email} successfully signedup.` });
        }
    });


});


router.post('/signin', function (req , res) {
    /*
    #swagger.parameters['user'] = {
        in: 'body',
        type: 'obj',
        schema: {             
            $email: 'user@fake-mail.com',
            $password: 'password1',
        }
    }
    #swagger.responses[200] = {
        role: "client",
        token: "eyJhbGciOi.NjIxMDc2MX0.o3CL-Sf8gh6wBj0"
    }
    */
   
    UserModel.findOne(req.body, function(err, theUser){
        if(err)
            res.send(err);
        if (theUser===null){
            res.status(401).send([]);     
        }else{
            const jwtBearerToken = jwt.sign({email:req.body.email, role:theUser.role}, process.env.SECRET,  {expiresIn: 1800});                
            res.status(201).send({
                    role: theUser.role,
                    token: jwtBearerToken
            }); 
        }
    })

});

// GET: /api/user
router.get('/', VerifyToken, function (req, res) {
    /*
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = [
    {
        "id": "63503ad1884c9bbb94551374",
        "name": "George Peter",
        "email": "user@fake-mail.com",
        "role": "client",
        "password": "password1"
    }]
    #swagger.responses[403] = {
        msg: "User user@fake-mail.com have no authorization."
    }
    */
    hasRole(req.role, 'manager', function (decision) {
        if (!decision) 
            return res.status(403).send({ msg: `User ${req.body.email} have no authorization.` });
        else
            UserModel.find(function (err, existingEntities) {
                if (err)
                    res.send(err);
                res.status(200).send(existingEntities);
            })
    })
});

function hasRole(userRole, role, func){
    func(userRole === role);
}

module.exports = router;