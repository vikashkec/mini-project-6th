const nodemailer=require('nodemailer');
let mailTransport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.ADMIN_MAIL,
        pass:process.env.ADMIN_PASSWORD
    }
});
module.exports={mailTransport};