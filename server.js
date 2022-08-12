
if(process.env.NODE_ENV!=='production'){
   require('dotenv').config()
}

const {MongoClient} =require('mongodb');
const cookieParser=require('cookie-parser');
const sessions=require('express-session');
const express=require('express');


const { users } = require('./role');
const { sendUserMail } = require('./mail/userMail');
const { mailTransport } = require('./mail/transport');
const { sendAdminMail } = require('./mail/adminMail');
const { main} = require('./mongoDB/mongoConnect');
const { client } = require('./mongoDB/credentials');
const { priceMail } = require('./mail/priceMail');

var session;

var oneDay=1000*60*60*24;
const app=express();
app.use(express.urlencoded({
    extended: true
  }))
  app.use(main);
app.use(sessions({
    secret:"thisismysescret",
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    resave:false

}));
app.use(cookieParser());
app.set('view-engine','ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.json());

app.set('views', __dirname + '/views'); 

app.post("/login",(req,res)=>{
    const username=String(req.body.user);
    const pass=String(req.body.pass);
    try{
        let isAdmin=users.some(element=>element.name===username && process.env.PASSWORD===pass);
        if(isAdmin){
                session=req.session;
                session.userid=username;
                res.redirect("/");
        }
        else{
            res.status(401);
        }


    }
    catch(e){
        console.error(e);
    }
  
    
})

app.get("/",async function(req,res){
    var det=req.det;
    session=req.session;
    if(session.userid){
       res.render('adminPage.ejs',{details:det});
    }
    else{
        res.render("home.ejs",{details:det});
    }

})
app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.get('/login',(req,res)=>{
   res.render('login.ejs')
})



app.get('/register',(req,res)=>{
    res.sendFile(__dirname+"/register.html");
})

app.post('/register',async function(req,res){
    const details=req.body;
    const email=String(req.body.email);
    await client.db("prices").collection("users").insertOne(details);
    if(email!==undefined){
       await sendUserMail(details,mailTransport);
        await sendAdminMail(details,mailTransport);
        res.redirect("/");
    }
    else{
        res.redirect("/register");
    }
})

app.post("/submitPrice",async function(req,res){
    const base=req.body.basic;
    const standard=req.body.standard;
    const premium=req.body.premium;
    await priceMail(req.body,mailTransport);
    var query={$set:{basic:base,standard:standard,premium:premium}};
    await client.db("prices").collection("gym_prices").updateOne({},query,function(err, res) {
        if (err) throw err;
       
     });
      const rehs=await client.db("prices").collection("gym_prices").find({},{ projection: { _id: 0 }}).toArray();
      res.render("adminPage.ejs",{details:rehs[0]});


})

app.listen(process.env.PORT || 3000,()=>{
    console.log("listening");
})