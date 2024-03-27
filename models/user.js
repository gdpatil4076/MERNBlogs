const express = require('express');
const {Schema , model} = require('mongoose');
const { createHmac,randomBytes } = require('node:crypto');


const UserSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    },
    role :{
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER",
    },
    likedBlog : {
        type : Array,
    }
}, {timestamps : true});

UserSchema.pre("save" , async function (next){
    
    const user = this;

    if (!user.isModified("password")) return ;

    const salt = randomBytes(16).toString();
    const HashedPassword = createHmac("sha256" , salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = HashedPassword;

    next();

})


UserSchema.static("MatchPassword" ,async function (email,password){
    const user = await this.findOne({email});
    if (!user) return "unof";

    const userSalt = user.salt;
    const userHash = user.password;

    const providedHash = createHmac("sha256" , userSalt).update(password).digest("hex");

    if (userHash !== providedHash) return  "inps";

    return user; 

});



const User = model('user' , UserSchema);



module.exports = User;
