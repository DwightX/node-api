const errors = require('restify-errors')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const auth = require("../auth")
const jwt = require('jsonwebtoken')
const config = require('../config')


module.exports = server => {
    // Register
    server.post('/register', (req,res,next) =>{

            const user = new User({
                email: req.body.email,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(user.password, salt, async(err,hash) => {
                    // Hash password
                    user.password = hash
                    //save user  
                    try{
                        const newUser = await user.save()
                        res.send(201);
                        next()
                    }catch(err){
                        return next(new errors.InternalError(err.message))
                    }
                })
            })
    })

    // Auth user

    server.post('/auth', async(req, res) => {
        const { email, password } = req.body;
    
        // Basic validation
        if (!email || !password) {
            res.status(400);  // Bad Request
            return res.json({
                success: false,
                message: 'Email and password are required'
            });
        }
    
        try {
            const user = await auth.authenticate(email, password);

            //create token

            const token = jwt.sign(user.toJSON(), config.JWT_SECRET,{
                expiresIn:'15m'
            });

            const {iat,exp} = jwt.decode(token)
            //respond with token
            res.send({iat,exp,token})

            console.log(user);
            res.json({
                success: true,
                user: {
                    email: user.email,
                    id: user._id
                }
            });
        } catch(err) {
            res.status(401);
            res.json({
                success: false,
                message: err.message || 'Authentication failed'
            });
        }
    })
}