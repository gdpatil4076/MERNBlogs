var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gauravpatil4076@gmail.com',
    pass: 'bnehacczflrvedtw'
  }
});

const CreateMail = async (receiverMail , message)=>{

    const mailOptions = {
        from: 'gauravpatil4076@gmail.com',
        to: `${receiverMail}`,
        subject: 'Sending Email using Node.js',
        text: `${message}`
    };

    return mailOptions;
}


const MailSender = async (mailOptions) =>{
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    CreateMail,MailSender
}



