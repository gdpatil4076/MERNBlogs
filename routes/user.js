const {Router} = require('express');
const USER = require('../models/user');
const {GenerateToken,ValidToken} = require('../service/authentication');
const BLOG = require('../models/blog');
const Blog = require('../models/blog');
const User = require('../models/user');
const NOTIFY = require('../models/notification');

const router = Router();

router.post('/signup', async (req,res)=>{
    
    console.log("signup = " , req.body);
    const {name,email,password} = req.body;
    
    try{
        const entry = await USER.create({ 
            name,email,password
        }); 
        return res.status(200).json({ message: 'Form submitted successfully' });
    }
    catch(error){
        res.status(500).json({ message: 'Duplicate Email' });
    }


}); 


router.post('/signin' ,async (req,res)=>{ 

    try{
        const {email,password} = req.body;

        const user = await USER.MatchPassword(email,password);
    
        if (user=="unof" || user=="inps"){
            return res.status(505).json({ message: 'User not Found' });
        }
        else{
            const token = await GenerateToken(user); 
            console.log("token = ",token);
            return res.cookie("token" , token,
            {
                sameSite: 'none', 
                httpOnly: true,
                secure: true
            }
            ).status(200).json(user);
        }
    }
    catch(error){
        console.log(error);
    }


}); 

router.get('/getuser' , async (req,res)=>{

    try{ 
        const User = await USER.findById(req.user._id)
        // console.log("From GetUser ", User);
        return res.status(200).json({msg : User});
    }
    catch(error){
        console.log(error);
    }

});

router.get('/getnotify' , async (req,res)=>{
    try{
        const Ids = req.user._id;
        const Notification = await NOTIFY.findOne({userId : Ids});
        //required to populate 
        return res.status(200).json({msg : Notification});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg : "Unknown Error"});
    }
});

router.get('/clearnotify' , async (req,res)=>{
    try{
        const Ids = req.user._id;
        const Notification = await NOTIFY.findOneAndUpdate({userId : Ids},{$set: { notification: [] }});
        //required to populate 
        return res.status(200).json({msg : Notification});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({msg : "Unknown Error"});
    }
});

router.get('/logout' , (req,res)=>{
    res.clearCookie("token");
    res.status(200).send("Logout")
});
 



module.exports =  router; 


