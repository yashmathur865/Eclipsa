const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("DB Connection Successful")})
    .catch((error)=>{
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })
}

// Get-ChildItem -Recurse -Include *.js -Exclude package.json, package-lock.json -File |
// Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
// Get-Content | Measure-Object -Line