// require('dotenv').config()

var {client} = require("./credentials");
var isConnected=true;

async function main(req,res,next){

        try{
            await client.connect();
            await listPrices(client,req,res);
        }
        catch(e){
            console.error(e);
        }          
         next();

}
async function listPrices(client,req,res){
    
    const result=await client.db("prices").collection("gym_prices").find({},{ projection: { _id: 0 }}).toArray()
    req.det=result[0];

}

module.exports={main};
