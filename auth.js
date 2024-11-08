const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User');

exports.authenticate = (email,password) => {
    return new Promise( async (resolve,reject) =>{
        try{
            //get user by email.
            const user = await User.findOne({email})
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err){
                    console.log(err)
                }

                if(isMatch){
                    resolve(user)
                }else{
                    reject('Auth Failed')
                }

            });
        }catch(err){
            reject("Auth Failed")
        }
    });
}