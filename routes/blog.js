const {Router} = require('express');
const router = Router();
const multer = require('multer');
const BLOG = require('../models/blog');
const path = require('path');
const Comment = require('../models/comment');
const {addNotification} = require("../service/notifi");
const {uploadOnCloudinary,deleteImage,replaceImage} = require('../service/cloudinary');
const fs = require('fs');
const {MailSender , CreateMail} = require('../service/emailer');
const {likeUpdater} = require('../service/likeUpdate');
const {CheckForAuthentication} = require("../middleware/restrictor");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null,('./public'));
    },
    filename: function (req, file, cb) {
        return cb(null,`${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});


router.post('/addnew', upload.single('profileImage'),async (req,res)=>{
    
    const {title,blog} = req.body;
    
    try{
        console.log("Addition Started !");
        if (!req.user) return res.status(204).json({msg : "User Not found"});
        console.log("check 1");
        const cloudiUrl = await uploadOnCloudinary(req.file.path);
console.log("check 2");
        const profileImageUrl = cloudiUrl.secure_url; 

        const publicId = cloudiUrl.public_id;
 
        const createdBy = req.user._id;

        
        const nblog = await BLOG.create({ 
            title,
            blog, 
            profileImageUrl,
            publicId,
            createdBy,
        });

        fs.unlinkSync(req.file.path); // delete file on local server 
        console.log("check 3");
        return res.status(200).json({msg : "Blog Added Successfully"});
    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg : "Error Adding a blog"});
    }

});

router.get('/addlike/:id' , async (req,res)=>{
    const blogId = (req.params.id);
    // console.log("HIHIIII", req.user.name , blogId);
    try{
        const ans = await likeUpdater(req.user.name , blogId , req.user._id);
        // console.log(ans);
        return res.status(200).json({msg : "Like Updated Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(700).json({msg : "User Not found"});
    }
});




router.get('/view/:id' , async (req,res)=>{

    const ids = req.params.id;

    try{

        const Blog = await BLOG.findOne({_id : ids}).populate('createdBy');
        const comments = await Comment.find({blogId : ids}).populate('createdBy');

        const Blog_Comments = {
            bloginfo : Blog,
            comment : comments
        };

        return res.status(200).json( {msg : Blog_Comments} );

    }
    catch(error){
        console.log(error);
        return res.status(500).json( {msg : "Error in Blog /view/:id"} );
    }

});


router.get('/edit/:id' , async (req,res)=>{

    const ids = req.params.id;

    try{

        const Blog = await BLOG.findOne({_id : ids}).populate('createdBy');
        
        return res.status(200).json( {msg : Blog} );

    }
    catch(error){
        console.log(error);
        return res.status(500).json( {msg : "Error in Blog /view/:id"} );
    }

});


router.post('/edit' , upload.single('profileImage'), async (req,res)=>{
    try{
        
        const {title,blog} = req.body;
        const userId = req.user._id;
        const bid = req.body.blogid;
        const fblog = await BLOG.findById(req.body.blogid);
        // console.log(`Blog needed  ${fblog}`);

        if (!fblog) {
            fs.unlinkSync(req.file.path);
            return res.status(300).json({msg : "Blog Not found for Updattion"})
        }
        else{
            // console.log("Requested file is " , req.file);
            const destroyImage = await deleteImage(fblog.publicId);
            const cloudiUrl = await replaceImage(fblog.publicId , req.file.path);
            // console.log(`Replaced Url  ${cloudiUrl}`);
            const nblog = await BLOG.findByIdAndUpdate
            ((bid) , {title : title , blog : blog , profileImageUrl : cloudiUrl });
            fs.unlinkSync(req.file.path);
            return res.status(200).json({msg : "Blog Updated Successfully"});
        }
    }
    catch(error){
        console.log(error);
    }
});



router.post('/comment/:blogId' , async (req,res)=>{

    try{

        const blogId = req.params.blogId;
        const oblog = await BLOG.findOne({_id : blogId}).populate('createdBy');
        // console.log("User in Request => " , req.user);
        const userId = req.user._id;
        const {comment} = req.body;
    
        console.log(req.user.name , comment );

        /// sending note to the notification collection
        const note = {
            msg : comment,
            createdBy : userId,
        };

        const answer = addNotification(oblog.createdBy._id , note);

        console.log(answer);
        ///
    
        const Coment = await Comment.create({
            content : comment,
            blogId : blogId,
            createdBy : userId, 
        });


        

        const newComment = await Comment.findById(Coment._id).populate('createdBy');


        // Mail Service //
        const message = `You Have got new comment on blog name = by ${req.user.name}`;
        const maile = await  CreateMail(oblog.createdBy.email , message);
        const sender = await MailSender(maile);
        const comments = await Comment.find({blogId : blogId}).populate('createdBy');

        return res.status(200).json({msg : "Comment added Successfully" , comet : newComment});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg : "Error in adding Comment"}); 
    }
})


router.get('/search', async (req, res) => {
    const query = req.query.q;
    console.log("Query => " , query);
    try {
        const regexQuery = new RegExp(`^${query}`, 'i'); // 'i' for case-insensitive search
        const results = await BLOG.find({ title: { $regex: regexQuery } });
        res.status(200).json({msg : results});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }

});

module.exports = router;

 
