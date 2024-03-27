const mongoose = require('mongoose');
mongoose.set("strictQuery" , true);
async function ConnectMongoDB(url){
    mongoose.connect(url);
}

module.exports = {
    ConnectMongoDB,
}