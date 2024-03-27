const {Schema , model} = require('mongoose');

const CommentSchema = new Schema({
    content : {
        type : String,
        required : true,
    },
    blogId : {
        type : Schema.Types.ObjectId,
        ref : 'blog',
        required : true,
    },
    createdBy :  {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : true,
    }
}, {timestamps : true});

const Comment = model('comment' , CommentSchema);

module.exports = Comment;
