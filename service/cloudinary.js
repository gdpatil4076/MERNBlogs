const {v2} = require('cloudinary');
const fs = require('fs');


v2.config({ 
    cloud_name: 'diiu4m0db', 
    api_key: '471162553268355', 
    api_secret: 'RnKtID9uLHsomdfYYGsAS0Ei5JE' 
}); 

const  uploadOnCloudinary  = async (localFilePath)=>{

    try{
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await  v2.uploader.upload(localFilePath,{
            resource_type : "auto",
        });
        //file uploaded successfully
        // console.log(`File Uploaded sucessfully `,response);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);  // removed the saved file on local storage
    }
}

const deleteImage = async (publicId)=>{
    try{
        const result = await v2.uploader.destroy(publicId);
        console.log(`Image is destroyed ${result.result}`)
    }
    catch(error){
        console.error(`Error deleting image: ${error.message}`);
    }
}

const replaceImage = async (publicId , localFilePath) =>{
    try{
        const newUrl = await v2.uploader.upload(localFilePath , {
            public_id : publicId,
            overwrite : true,
        });

        console.log(`File replaced Successfully with Secure Url ${newUrl.secure_url}`);

        return newUrl.secure_url;
    }
    catch(error){
        console.error(`Error replacing image: ${error.message}`);
    }
}


module.exports = {
    uploadOnCloudinary,deleteImage,replaceImage
}