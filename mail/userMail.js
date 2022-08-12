if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
 }
async function sendUserMail(details,mailTransport){
    const message=`Good day ${details.username} \n You had booked ${details.package}.\n Here are the filled details: \n EMAIL : ${details.email} \n PHONE No: ${String(details.phoneno)} \n Reason : ${details.reason} \n Timing : From ${String(details.from)} To ${String(details.to)} \n We expect you at the earliest!!`;
    let mailDetails={
        from:process.env.ADMIN_MAIL,
        to:String(details.email),
        subject:'Booked successfully',
        text:message,
        //age
        //weight
        //gender- details.gender
    };
    await mailTransport.sendMail(mailDetails,function(err,data){
        if(err){
            console.error(err);
        }
        else{
            console.log('email sent succcessfully');
        }
    })
};
module.exports={sendUserMail};