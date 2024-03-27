const {Schema , model} = require('mongoose');

const BlogSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    blog : {
        type : String,
        required : true,
    },
    profileImageUrl : {
        type : String,
    },
    publicId : {
        type : String
    },
    createdBy :{
        type : Schema.Types.ObjectId,
        ref : "user",
    },
    likedBy :{
        type : Array,
    }
}, {timestamps : true});

BlogSchema.index({ title: 'text', blog: 'text' });

const Blog = model('blog' , BlogSchema);

module.exports = Blog;
