async function sendAdminMail(details,mailTransport){
    console.log(String(details.from))
    const message=`Good day Admin!! \n ${details.username} had booked ${details.package}.\n Here are the details of the customer: \n EMAIL : ${details.email} \n PHONE No: ${String(details.phoneno)} \n Reason : ${details.reason} \n Timing : From ${String(details.from)} To ${String(details.to)}`;
    let mailDetails={
        from:process.env.ADMIN_MAIL,
        to:process.env.ADMIN_MAIL,
        subject:'Confirmation mail',
        text:message,
       
    };
    await mailTransport.sendMail(mailDetails,function(err,data){
        if(err){
            console.log('error');
        }
        else{
            console.log('email sent succcessfully');
        }
    })

};
module.exports={sendAdminMail};