const mongoose = require('mongoose');
const BLOG = require('../models/blog');
const USER = require('../models/user');

async function likeUpdater(userName , blogId , userId){

    try {
        // Use await to make sure the findByIdAndUpdate operation completes before moving on
        
        // const user = await USER.findById(userId);
        const blog = await BLOG.findById(blogId);

        const isliked = (blog.likedBy.includes(userName));

        
        const updateb = await  isliked
        ? { $pull: { likedBy: userName } }
        : { $addToSet: { likedBy: userName } }; 

        const updatedBlog = await BLOG.findByIdAndUpdate(
            blogId,
            updateb,
            { new: true } // This option returns the updated document
        );


        const updateuser = await  isliked
        ? { $pull: { likedBlog: blogId } }
        : { $addToSet: { likedBlog: blogId } }; 

        const updatedUser = await USER.findByIdAndUpdate(
            userId,
            updateuser,
            {new : true}
        );

        // console.log("Like Updated Successfully");
        // console.log(updatedBlog);

        return updatedBlog;
    } catch (error) {
        console.error("Error updating like:", error);
        throw error; // Re-throw the error for higher-level error handling
    }

}

module.exports = {
    likeUpdater
}