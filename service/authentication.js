const JWT = require('jsonwebtoken');
const secret = "Gaurav@123";

async function GenerateToken(user){
    const payload = {
        _id : user._id,
        name : user.name,
        email : user.email,
        profileImage : user.profileImage,
        role : user.role,
    }

    const token = await JWT.sign(payload,secret);

    return token;
}

async function ValidToken(token){
    const payload = await JWT.verify(token,secret);
    return payload;
}

module.exports = {
    GenerateToken,ValidToken
}