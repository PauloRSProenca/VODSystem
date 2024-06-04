var express = require('express');
var UserModel = require('../models/user');

SignUp = (req, res) => {
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/definitions/User1" }  
            }
        }
    }
    */
    /*
    #swagger.responses[201] = {
        description: "Created",
        content: {
            "application/json": {
                schema: { $ref: "#/definitions/OkSignUp" }
            }           
        }
    }

    */

    var newuser = new UserModel();

    newuser.name = req.body.name;
    newuser.email = req.body.email;
    newuser.role = 'client';
    newuser.password = req.body.password;

    newuser.save(function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(201).send({ msg: `User ${req.body.email} successfully signedup.` });
        }
    });
}

SignIn = (req, rep) => {
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/User2" }  
                }
            }
        }
        #swagger.responses[201] = {
            description: "Created",
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/SuccessfulSignIn" }  
                }           
            }
        }  
    */

    UserModel.findOne(req.body, function (err, theUser) {
        if (err)
            res.send(err);
        if (theUser === null) {
            res.status(401).send([]);
        } else {
            const jwtBearerToken = jwt.sign({ email: req.body.email, role: theUser.role }, process.env.SECRET, { expiresIn: 1800 });
            res.status(201).send({
                role: theUser.role,
                token: jwtBearerToken
            });
        }
    })
}

GetAllUsers = (req, res) => {
    /*
    #swagger.security = [{
        "bearerAuth": []
    }]

    #swagger.responses[200] = {
        description: "OK",
        content: {
            "application/json": {
                schema:{ $ref: "#/definitions/User3" }
            }           
        }
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
        else
            UserModel.find(function (err, existingEntities) {
                if (err)
                    res.send(err);
                res.status(200).send(existingEntities);
            })
    })
}

function hasRole(userRole, role, func) {
    func(userRole === role);
}

module.exports = {
    SignUp,
    SignIn,
    GetAllUsers
}