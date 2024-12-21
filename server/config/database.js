const mongoose=require ("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.connect = (MONGO) =>{
    // console.log("asdfasdfasdfadsfasd",process.env.MONGODB_URL);
    // console.log("MONGO",MONGO);
    mongoose.connect(process.env.MONGODB_URL || MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB connected successfully"))
    .catch((error)=>{
        console.log("DB connection fail");
        console.log(error);
        process.exit(1);
    })
}